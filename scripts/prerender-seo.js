// Writes a static HTML file per route with that route's own head tags
// (title, description, canonical, Open Graph) AND unique crawlable body
// content so Google does not have to execute JavaScript to see a page.
// Runs after `vite build`. Never fails the build.

import { writeFileSync, readFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import {
  collectPages,
  absoluteUrl,
  htmlEscape,
  discoveryLinks,
  fetchRows,
  canonicalPath,
} from './seo-lib.mjs';

const DIST = resolve('dist');

function jsonLd(page, links) {
  const url = absoluteUrl(page.path);
  const graph = [
    {
      '@type': 'WebPage',
      name: page.h1 || page.title,
      description: page.description,
      url,
    },
  ];
  const children = links.filter((l) => l.path !== page.path).slice(0, 80);
  if (children.length) {
    graph.push({
      '@type': 'ItemList',
      name: page.h1 || page.title,
      itemListElement: children.map((l, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: l.name,
        url: absoluteUrl(l.path),
      })),
    });
  }
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  })}</script>`;
}

function crawlerBody(page, links) {
  const heading = htmlEscape(page.h1 || page.title);
  const description = htmlEscape(page.description);
  const items = links
    .map((l) => `<li><a href="${htmlEscape(canonicalPath(l.path))}">${htmlEscape(l.name)}</a></li>`)
    .join('');
  return `<article class="seo-crawler">
      <h1>${heading}</h1>
      <p>${description}</p>
      <nav aria-label="Related pages"><ul>${items}</ul></nav>
    </article>`;
}

function resetTemplate(html) {
  return html
    .replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"><!--app-html--></div>')
    .replace(/\s*<script type="application\/ld\+json">\{"@context":"https:\/\/schema.org","@graph":\[\{"@type":"WebPage"[\s\S]*?<\/script>/g, '')
    .replace(/\s*<meta name="robots"[^>]*>/g, '');
}

function applyHead(template, page, links) {
  const url = absoluteUrl(page.path);
  const title = htmlEscape(page.title);
  const description = htmlEscape(page.description);
  const type = page.ogType || 'website';
  const robots = page.noIndex ? 'noindex, nofollow' : 'index, follow';

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`);

  if (page.noIndex) {
    html = html
      .replace(/\s*<link rel="canonical"[^>]*>/, '')
      .replace(/\s*<meta property="og:url"[^>]*>/, '');
  } else {
    html = html
      .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
      .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
  }

  if (/<meta name="robots"/i.test(html)) {
    html = html.replace(/<meta name="robots"[^>]*>/, `<meta name="robots" content="${robots}" />`);
  } else {
    html = html.replace('</head>', `    <meta name="robots" content="${robots}" />\n  </head>`);
  }

  if (!page.noIndex) {
    html = html.replace('</head>', `    ${jsonLd(page, links)}\n  </head>`);
  }
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>/,
    `<div id="root">${crawlerBody(page, links)}</div>`
  );
  return html;
}

async function appendBlogRedirects() {
  const redirectsPath = join(DIST, '_redirects');
  if (!existsSync(redirectsPath)) return;
  const existing = readFileSync(redirectsPath, 'utf-8');
  if (existing.includes('# Blog slug redirects')) return;
  const rows = await fetchRows('blog_slug_redirects', 'select=old_slug,new_slug&limit=5000');
  if (!rows.length) return;
  const lines = ['', '# Blog slug redirects'];
  for (const row of rows) {
    if (!row.old_slug || !row.new_slug || row.old_slug === row.new_slug) continue;
    const from = `/blog/${encodeURIComponent(row.old_slug)}`;
    const to = `/blog/${encodeURIComponent(row.new_slug)}`;
    lines.push(`${from} ${to} 301`);
  }
  if (lines.length > 2) {
    appendFileSync(redirectsPath, `${lines.join('\n')}\n`);
    console.log(`prerender-seo: appended ${lines.length - 2} blog redirects`);
  }
}

async function run() {
  const indexPath = join(DIST, 'index.html');
  if (!existsSync(indexPath)) {
    console.warn('prerender-seo: dist/index.html missing, skipping');
    return;
  }
  const template = resetTemplate(readFileSync(indexPath, 'utf-8'));
  const pages = await collectPages();

  let written = 0;
  for (const page of pages) {
    const links = discoveryLinks(page, pages);
    const html = applyHead(template, page, links);
    if (page.path === '/') {
      writeFileSync(indexPath, html);
    } else {
      const dir = join(DIST, ...page.path.replace(/^\/|\/$/g, '').split('/'));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html);
    }
    written += 1;
  }

  const notFound = applyHead(
    template,
    {
      path: '/404',
      title: 'Page Not Found | Financial Professional',
      description: 'The page you are looking for could not be found.',
      h1: 'Page not found',
      noIndex: true,
    },
    discoveryLinks({ path: '/404', kind: 'private' }, pages)
  );
  writeFileSync(join(DIST, '404.html'), notFound);

  await appendBlogRedirects();
  console.log(`prerender-seo: wrote head tags and crawlable HTML for ${written} routes`);
}

run().catch((err) => {
  console.warn('prerender-seo: skipped due to error:', err.message);
});
