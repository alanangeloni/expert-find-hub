// Writes a fully rendered HTML file per public route: page body (text, links),
// the route's own head tags (title, description, canonical, Open Graph) and
// its JSON-LD, so crawlers get complete content before any JavaScript runs.
// Runs after the client and server builds. Never fails the build: a route
// that cannot render falls back to head-only HTML.

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { collectPages, absoluteUrl, htmlEscape } from './seo-lib.mjs';

const DIST = resolve('dist');
const SSR_ENTRY = resolve('dist-ssr/entry-server.js');

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

// JSON inside <script> must not be able to close the tag.
const safeJson = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

function applyBody(html, page, rendered) {
  const boot =
    `<script>window.__PRERENDER_PATH__=${safeJson(page.path)};` +
    `window.__RQ_STATE__=${safeJson(rendered.state)};</script>`;
  return html
    .replace('<!--app-html-->', rendered.appHtml)
    .replace('</head>', `${rendered.scriptTags}\n${boot}\n</head>`);
}

function outputPath(path) {
  if (path === '/') return join(DIST, 'index.html');
  const dir = join(DIST, ...path.replace(/^\/|\/$/g, '').split('/'));
  mkdirSync(dir, { recursive: true });
  return join(dir, 'index.html');
}

async function run() {
  const indexPath = join(DIST, 'index.html');
  if (!existsSync(indexPath)) {
    console.warn('prerender: dist/index.html missing, skipping');
    return;
  }
  const template = readFileSync(indexPath, 'utf-8');
  const pages = await collectPages();

  let render = null;
  try {
    ({ render } = await import(pathToFileURL(SSR_ENTRY).href));
  } catch (err) {
    console.warn('prerender: server bundle unavailable, writing head tags only:', err.message);
  }

  let full = 0;
  let headOnly = 0;
  const started = Date.now();
  for (const page of pages) {
    let html = applyHead(template, page);
    if (render) {
      try {
        const rendered = await render(page.path);
        html = applyBody(html, page, rendered);
        full += 1;
      } catch (err) {
        console.warn(`prerender: ${page.path} rendered head only:`, err.message);
        headOnly += 1;
      }
    } else {
      headOnly += 1;
    }
    writeFileSync(outputPath(page.path), html);
  }
  console.log(
    `prerender: ${full} full pages, ${headOnly} head-only, ${((Date.now() - started) / 1000).toFixed(1)}s`
  );
}

run()
  .catch((err) => console.warn('prerender: skipped due to error:', err.message))
  .finally(() => process.exit(0));
