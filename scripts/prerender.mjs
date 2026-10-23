// Writes a static HTML file per route with that route's own head tags
// (title, description, canonical, Open Graph) so crawlers get correct,
// self-referencing metadata before any JavaScript runs.
// Runs after `vite build`. Never fails the build.

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { collectPages, absoluteUrl, htmlEscape } from './seo-lib.mjs';

const DIST = resolve('dist');

function applyHead(template, page) {
  const url = absoluteUrl(page.path);
  const title = htmlEscape(page.title);
  const description = htmlEscape(page.description);
  const type = page.ogType || 'website';

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`);
}

async function run() {
  const indexPath = join(DIST, 'index.html');
  if (!existsSync(indexPath)) {
    console.warn('prerender-seo: dist/index.html missing, skipping');
    return;
  }
  const template = readFileSync(indexPath, 'utf-8');
  const pages = await collectPages();

  let written = 0;
  for (const page of pages) {
    const html = applyHead(template, page);
    if (page.path === '/') {
      writeFileSync(indexPath, html);
    } else {
      const dir = join(DIST, ...page.path.replace(/^\/|\/$/g, '').split('/'));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html);
    }
    written += 1;
  }
  console.log(`prerender-seo: wrote head tags for ${written} routes`);
}

run().catch((err) => {
  console.warn('prerender-seo: skipped due to error:', err.message);
});
