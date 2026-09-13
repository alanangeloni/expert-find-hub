// Generates public/sitemap.xml from the shared SEO page list.
// Every URL is percent-encoded, lowercase, and has no trailing slash (except "/").
// Runs via predev/prebuild. Falls back to whatever it can fetch.

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { collectPages, absoluteUrl, xmlEscape } from './seo-lib.mjs';

function toXml(entries) {
  const urls = entries.map((e) =>
    [
      '  <url>',
      `    <loc>${xmlEscape(absoluteUrl(e.path))}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

const entries = await collectPages();
writeFileSync(resolve('public/sitemap.xml'), toXml(entries), 'utf-8');
console.log(`sitemap.xml written (${entries.length} entries)`);
