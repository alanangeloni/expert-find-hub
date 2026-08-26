// Generates public/sitemap.xml with static routes + every public detail page.
// Runs via predev/prebuild. Falls back to static-only if Supabase is unreachable.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE_URL = 'https://financialprofessional.com';

function env(name) {
  if (process.env[name]) return process.env[name];
  const path = resolve('.env');
  if (!existsSync(path)) return undefined;
  const line = readFileSync(path, 'utf-8')
    .split('\n')
    .find((l) => l.startsWith(`${name}=`));
  if (!line) return undefined;
  return line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '');
}

const SUPABASE_URL = env('VITE_SUPABASE_URL');
const SUPABASE_KEY = env('VITE_SUPABASE_PUBLISHABLE_KEY');

const staticEntries = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/advisors', changefreq: 'daily', priority: '0.9' },
  { path: '/firms', changefreq: 'daily', priority: '0.9' },
  { path: '/accounting-firms', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog', changefreq: 'daily', priority: '0.8' },
  { path: '/advisor-registration', changefreq: 'monthly', priority: '0.6' },
];

async function fetchRows(table, query) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  try {
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) {
      console.warn(`sitemap: ${table} returned ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn(`sitemap: could not fetch ${table}:`, err.message);
    return [];
  }
}

const isoDay = (value) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().split('T')[0];
};

async function collect() {
  const [advisors, firms, accountingFirms, posts] = await Promise.all([
    fetchRows('financial_advisors_public', 'select=slug,updated_at&slug=not.is.null&limit=5000'),
    fetchRows('investment_firms', 'select=slug,updated_at&slug=not.is.null&limit=5000'),
    fetchRows('accounting_firms', 'select=slug,updated_at&slug=not.is.null&limit=5000'),
    fetchRows('blog_posts', 'select=slug,updated_at,published_at&status=eq.published&slug=not.is.null&limit=5000'),
  ]);

  return [
    ...staticEntries,
    ...advisors.map((r) => ({
      path: `/advisors/${r.slug}`,
      lastmod: isoDay(r.updated_at),
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...firms.map((r) => ({
      path: `/firms/${r.slug}`,
      lastmod: isoDay(r.updated_at),
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...accountingFirms.map((r) => ({
      path: `/accounting-firms/${r.slug}`,
      lastmod: isoDay(r.updated_at),
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...posts.map((r) => ({
      path: `/blog/${r.slug}`,
      lastmod: isoDay(r.updated_at || r.published_at),
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];
}

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function toXml(entries) {
  const urls = entries.map((e) =>
    [
      '  <url>',
      `    <loc>${escape(BASE_URL + e.path)}</loc>`,
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

const entries = await collect();
writeFileSync(resolve('public/sitemap.xml'), toXml(entries), 'utf-8');
console.log(`sitemap.xml written (${entries.length} entries)`);
