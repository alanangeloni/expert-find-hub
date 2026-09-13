// Shared SEO data layer for build-time sitemap generation and head-tag prerendering.
// Keeps titles/descriptions/canonicals identical between the two.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export const BASE_URL = 'https://financialprofessional.com';

/* ------------------------------------------------------------------ env */

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

export async function fetchRows(table, query) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) {
      console.warn(`seo: ${table} returned ${res.status}`);
      return [];
    }
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.warn(`seo: could not fetch ${table}:`, err.message);
    return [];
  }
}

/* ----------------------------------------------------------------- text */

const collapse = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

export const clampAtWord = (value, max, ellipsis = '') => {
  const text = collapse(value);
  const limit = max - ellipsis.length;
  if (text.length <= max) return text;
  const cut = text.slice(0, limit + 1);
  const lastSpace = cut.lastIndexOf(' ');
  const base = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut.slice(0, limit)).replace(/[\s,;:.\-—–]+$/, '');
  return `${base}${ellipsis}`;
};

export const seoTitle = (main, suffix = 'Financial Professional') => {
  const head = collapse(main);
  if (!suffix) return clampAtWord(head, 60);
  const tail = ` | ${suffix}`;
  if (head.length + tail.length <= 60) return `${head}${tail}`;
  const room = 60 - tail.length;
  if (room >= 24) return `${clampAtWord(head, room)}${tail}`;
  return clampAtWord(head, 60);
};

export const seoDescription = (base, ...filler) => {
  let text = collapse(base);
  for (const extra of filler) {
    if (text.length >= 150) break;
    const next = collapse(extra);
    if (!next) continue;
    const joined = `${text.replace(/[.\s]+$/, '')}. ${next}`.replace(/^\.\s*/, '');
    if (joined.length <= 158) text = joined;
  }
  if (text.length <= 158) return text;
  return clampAtWord(text, 158, '…');
};

const stripMarkup = (v) =>
  collapse(String(v ?? '').replace(/<[^>]*>/g, ' ').replace(/[#*_>`[\]()]/g, ' '));

/* ----------------------------------------------------------------- urls */

/** Lowercase, URL-safe slug: no reserved characters, no spaces, no colons. */
export const slugify = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Percent-encode every path segment. Convention sitewide: no trailing slash
 * except the homepage.
 */
export const canonicalPath = (path) => {
  const clean = `/${String(path ?? '')}`.replace(/\/+/g, '/').replace(/\/+$/, '');
  if (!clean) return '/';
  return clean
    .split('/')
    .map((seg) => encodeURIComponent(decodeURIComponent(seg)))
    .join('/');
};

export const absoluteUrl = (path) => `${BASE_URL}${canonicalPath(path)}`;

export const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const htmlEscape = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const isoDay = (value) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().split('T')[0];
};

/* ---------------------------------------------------------------- lists */

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
  'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
];

// Asset classes that are not advisory businesses. Their profile pages stay
// reachable, but they are excluded from the firms section of the sitemap.
const NON_ADVISORY_ASSET_CLASSES = new Set(['Cryptocurrency']);

/* ---------------------------------------------------------------- pages */

const staticPages = [
  {
    path: '/',
    title: 'Find a Financial Professional | Fiduciary Advisors',
    description: seoDescription(
      'Match with vetted, fee-only fiduciary financial advisors based on your goals, assets, and stage of life. Free to search, free to get matched.'
    ),
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/advisors',
    title: seoTitle('Find a Financial Advisor'),
    description: seoDescription(
      'Search vetted fiduciary financial advisors by specialty, location, and fees',
      'Compare up to three advisors side by side and request an introduction free.'
    ),
    changefreq: 'daily',
    priority: '0.9',
  },
  {
    path: '/financial-professionals',
    title: seoTitle('Financial Professionals by State'),
    description: seoDescription(
      'Find a financial professional in your state',
      'Browse vetted fiduciary advisors and firms across all 50 states, Washington, D.C., and Puerto Rico.'
    ),
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/services',
    title: seoTitle('Financial Advisor Services by Specialty'),
    description: seoDescription(
      'Browse financial professionals by specialty, from retirement and tax planning to estate, business, and investment management',
      'Compare vetted fiduciaries free.'
    ),
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/firms',
    title: seoTitle('Investment Firms Directory'),
    description: seoDescription(
      'Browse independent investment firms by asset class, minimum investment, and assets under management',
      'Compare fees, returns, and liquidity in one place.'
    ),
    changefreq: 'daily',
    priority: '0.9',
  },
  {
    path: '/accountants',
    title: seoTitle('Find an Accountant or CPA'),
    description: seoDescription(
      'Search vetted accountants and CPAs by specialty, service, location, and credentials',
      'Compare pricing and industries served, then request an introduction free.'
    ),
    changefreq: 'daily',
    priority: '0.8',
  },
  {
    path: '/accounting-firms',
    title: seoTitle('Accounting Firms Directory'),
    description: seoDescription(
      'Connect with accounting firms that handle bookkeeping, tax, and business finance',
      'Compare services, minimums, and locations before you reach out.'
    ),
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/blog',
    title: seoTitle('The Journal: Money Guides'),
    description: seoDescription(
      'Practical guides on fiduciaries, fees, life transitions, and finding financial advice that actually fits your situation',
      'Written for real decisions.'
    ),
    changefreq: 'daily',
    priority: '0.8',
  },
  {
    path: '/advisor-registration',
    title: seoTitle('List Your Advisor Profile'),
    description: seoDescription(
      'Join the Financial Professional directory and reach clients searching for fiduciary advice',
      'Submit your profile for review, free of charge.'
    ),
    changefreq: 'monthly',
    priority: '0.6',
  },
];

const advisorLocation = (city, state) => [city, state].filter(Boolean).join(', ');

export async function collectPages() {
  const [advisors, firms, accountingFirms, accountants, posts] = await Promise.all([
    fetchRows(
      'financial_advisors_public',
      'select=slug,name,position,firm_name,city,state_hq,personal_bio,updated_at,advisor_services&slug=not.is.null&limit=5000'
    ),
    fetchRows(
      'investment_firms',
      'select=slug,name,description,minimum_investment,asset_class,updated_at&slug=not.is.null&limit=5000'
    ),
    fetchRows(
      'accounting_firms',
      'select=slug,name,description,long_description,updated_at&slug=not.is.null&limit=5000'
    ),
    fetchRows(
      'accountants_public',
      'select=slug,name,credentials,bio,city,state_hq,firm_name,client_specialties,updated_at&slug=not.is.null&limit=5000'
    ),
    fetchRows(
      'blog_posts',
      'select=slug,title,excerpt,content,updated_at,published_at&status=eq.published&slug=not.is.null&limit=5000'
    ),
  ]);

  const pages = [...staticPages];

  // Advisor profiles
  for (const a of advisors) {
    const loc = advisorLocation(a.city, a.state_hq);
    pages.push({
      path: `/advisors/${a.slug}`,
      title: seoTitle(`${a.name}, ${a.position || 'Financial Advisor'}`),
      description: seoDescription(
        stripMarkup(a.personal_bio) ||
          `${a.position || 'Financial advisor'}${a.firm_name ? ` at ${a.firm_name}` : ''}${loc ? ` in ${loc}` : ''}`,
        'See specialties, fees, minimums, and credentials, then request an introduction free.'
      ),
      lastmod: isoDay(a.updated_at),
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  // Service (specialty) landing pages
  const serviceCounts = new Map();
  for (const a of advisors) {
    for (const s of a.advisor_services || []) {
      serviceCounts.set(s, (serviceCounts.get(s) || 0) + 1);
    }
  }
  for (const [service, count] of [...serviceCounts.entries()].sort()) {
    pages.push({
      path: `/services/${slugify(service)}`,
      title: seoTitle(`${service} Advisors`),
      description: seoDescription(
        `Find a financial professional for ${service.toLowerCase()}`,
        `Compare ${count} vetted fiduciary advisors on credentials, fees, and minimums, then request a free introduction.`
      ),
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // State landing pages (every state, D.C. and Puerto Rico)
  const stateCounts = new Map();
  for (const a of advisors) {
    if (a.state_hq) stateCounts.set(a.state_hq, (stateCounts.get(a.state_hq) || 0) + 1);
  }
  for (const state of US_STATES) {
    const count = stateCounts.get(state) || 0;
    pages.push({
      path: `/financial-professionals/${slugify(state)}`,
      title: seoTitle(`Financial Professionals in ${state}`),
      description: seoDescription(
        count > 0
          ? `Compare ${count} vetted financial professionals in ${state}`
          : `Find a financial professional serving ${state}`,
        'See specialties, fees, minimums, and credentials, then request a meeting free.'
      ),
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  // Accountant profiles
  for (const a of accountants) {
    const creds = (a.credentials || []).slice(0, 2).join(', ');
    const loc = advisorLocation(a.city, a.state_hq);
    pages.push({
      path: `/accountants/${a.slug}`,
      title: seoTitle(`${a.name}${creds ? `, ${creds}` : ''}`),
      description: seoDescription(
        stripMarkup(a.bio) ||
          `Accountant${a.firm_name ? ` at ${a.firm_name}` : ''}${loc ? ` in ${loc}` : ''}`,
        'See services, industries served, pricing, and credentials, then request an introduction.'
      ),
      lastmod: isoDay(a.updated_at),
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  // Accountant specialty pages
  const specialties = new Set();
  for (const a of accountants) for (const s of a.client_specialties || []) specialties.add(s);
  for (const specialty of [...specialties].sort()) {
    pages.push({
      path: `/accountants/specialty/${slugify(specialty)}`,
      title: seoTitle(`Accountants for ${specialty}`),
      description: seoDescription(
        `Find vetted accountants who specialize in ${specialty.toLowerCase()}`,
        'Compare credentials, services, industries served, and pricing before you reach out.'
      ),
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // Investment firm profiles (advisory businesses only)
  for (const f of firms) {
    if (NON_ADVISORY_ASSET_CLASSES.has(f.asset_class)) continue;
    const min = f.minimum_investment != null ? `$${Number(f.minimum_investment).toLocaleString('en-US')}` : 'not specified';
    pages.push({
      path: `/firms/${f.slug}`,
      title: seoTitle(`${f.name} Review`),
      description: seoDescription(
        stripMarkup(f.description) || `${f.name} investment firm review`,
        `Minimum investment: ${min}.`,
        'Compare fees, liquidity, and returns.'
      ),
      lastmod: isoDay(f.updated_at),
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  // Accounting firm profiles
  for (const f of accountingFirms) {
    pages.push({
      path: `/accounting-firms/${f.slug}`,
      title: seoTitle(`${f.name}`, 'Accounting Firm'),
      description: seoDescription(
        stripMarkup(f.description || f.long_description) || `Accounting services from ${f.name}`,
        'Compare services, fees, and minimums, then get in touch.'
      ),
      lastmod: isoDay(f.updated_at),
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  // Blog posts
  for (const p of posts) {
    pages.push({
      path: `/blog/${p.slug}`,
      title: seoTitle(p.title),
      description: seoDescription(
        stripMarkup(p.excerpt) || stripMarkup(p.content).slice(0, 300),
        'Read the full guide on Financial Professional.'
      ),
      lastmod: isoDay(p.updated_at || p.published_at),
      changefreq: 'monthly',
      priority: '0.7',
      ogType: 'article',
    });
  }

  // De-duplicate by canonical path, keeping the first entry.
  const seen = new Set();
  return pages.filter((p) => {
    const key = canonicalPath(p.path);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
