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

const collapse = (v) =>
  String(v ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&/g, ' and ')
    .replace(/["<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

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
  // Never cut the page's own name to keep the brand suffix: drop the suffix.
  return clampAtWord(head, 60);
};

export const seoDescription = (base, ...filler) => {
  let text = collapse(base);
  for (const extra of filler) {
    if (text.length >= 150) break;
    const next = collapse(extra);
    if (!next) continue;
    const joined = `${text.replace(/[.\s]+$/, '')}. ${next}`.replace(/^\.\s*/, '');
    if (joined.length <= 160) text = joined;
  }
  if (text.length <= 160) return text;
  return clampAtWord(text, 160, '…');
};

const stripMarkup = (v) =>
  collapse(String(v ?? '').replace(/<[^>]*>/g, ' ').replace(/[#*_>`[\]()]/g, ' '));

/* ----------------------------------------------------------------- urls */

/** Lowercase, URL-safe slug: no reserved characters, no spaces, no colons. */
export const slugify = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
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

// Keep in sync with src/constants/advisorServices.ts so every SPA service route
// is prerendered (empty ones are noindexed and omitted from the sitemap).
export const ALL_SERVICES = [
  'Alternative Investments',
  'Budgeting',
  'Business Succession Planning',
  'Cash Flow Analysis',
  'Cryptocurrency & NFTs',
  'Debt Management',
  'Divorce Planning',
  'Early Career Planning',
  'Education Planning',
  'Elder Care',
  'Employee/Employer Benefits',
  'Environment, Social, and Governance',
  'Estate/Trust Planning',
  'Expat & Cross-Border Planning',
  'Financial Planning',
  'Health Care',
  'Inheritance',
  'Insurance Planning',
  'Investment Management',
  'Life Transitions',
  'Long-term Care',
  'Philanthropy Planning',
  'Portfolio Construction',
  'Retirement Income Management',
  'Retirement Planning',
  'Small Business Planning',
  'Socially Responsible Investing',
  'Social Security Planning',
  'Special Needs Planning',
  'Sports and Entertainment',
  'Succession Planning',
  'Tax Planning',
  'Wealth Management',
];

export const ACCOUNTANT_SPECIALTIES = [
  'Athletes & Entertainers',
  'Bootstrapped Companies',
  'Business Executives',
  'Business Owners/Entrepreneurs',
  'Content Creators',
  'Cryptocurrency Investors',
  'Crypto Investors',
  'Digital Nomads',
  'Divorced Individuals',
  'E-commerce Businesses',
  'Enterprise Companies ($50M+)',
  'Equity Compensation (RSUs, Stock Options)',
  'Generational Wealth Transfer',
  'Growing Companies ($1M-$10M)',
  'HENRY (High Earners Not Rich Yet)',
  'High Net Worth Individuals',
  'International/Expats',
  'K1 Partnership Income',
  'Mid-Market Companies ($10M-$50M)',
  'Multi-generational Families',
  'Multi-state Returns',
  'Pre-Retirees (5-10 years out)',
  'Pre-revenue Startups',
  'Private Equity-Backed Companies',
  'Professors & Educators',
  'QSBS Holders',
  'Real Estate Investors',
  'Retirees',
  'SMB Owner',
  'SMB Owners',
  'Solopreneurs',
  'Ultra High Net Worth Individuals',
  'VC Backed',
  'VC Backed Startups',
  'Young Professionals',
];

const PRIVATE_PAGES = [
  {
    path: '/auth/signin',
    title: 'Sign In | Financial Professional',
    description: 'Sign in to your Financial Professional account.',
    noIndex: true,
  },
  {
    path: '/auth/signup',
    title: 'Create an Account | Financial Professional',
    description: 'Create a Financial Professional account to save advisors and request introductions.',
    noIndex: true,
  },
  {
    path: '/auth/forgot-password',
    title: 'Reset Your Password | Financial Professional',
    description: 'Request a password reset link for your Financial Professional account.',
    noIndex: true,
  },
  {
    path: '/auth/reset-password',
    title: 'Set a New Password | Financial Professional',
    description: 'Choose a new password for your Financial Professional account.',
    noIndex: true,
  },
  {
    path: '/advisor-profile',
    title: 'Your Advisor Profile | Financial Professional',
    description: 'Manage your advisor profile and meeting requests.',
    noIndex: true,
  },
  {
    path: '/app',
    title: 'Investment Platform | Financial Professional',
    description: 'Professional investment tools on Financial Professional.',
    noIndex: true,
  },
  {
    path: '/admin/blog',
    title: 'Admin | Financial Professional',
    description: 'Internal admin dashboard.',
    noIndex: true,
  },
  {
    path: '/admin/blog/new',
    title: 'Admin | Financial Professional',
    description: 'Internal blog editor.',
    noIndex: true,
  },
  {
    path: '/admin/entities',
    title: 'Admin | Financial Professional',
    description: 'Internal admin dashboard.',
    noIndex: true,
  },
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
    h1: 'Achieve your Financial Goals with a Financial Professional',
    linkName: 'Home',
    kind: 'hub',
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
    h1: 'Find your Financial Advisor',
    linkName: 'Find advisors',
    kind: 'hub',
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
    h1: 'Browse Financial Professionals by State',
    linkName: 'Browse by state',
    kind: 'hub',
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
    h1: 'Browse Financial Professionals by Specialty',
    linkName: 'Browse by specialty',
    kind: 'hub',
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
    h1: 'Browse independent investment firms',
    linkName: 'Investment firms',
    kind: 'hub',
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
    h1: 'Find your Accountant',
    linkName: 'Accountants',
    kind: 'hub',
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
    h1: 'Accounting firms directory',
    linkName: 'Accounting firms',
    kind: 'hub',
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
    h1: 'The Journal: Money Guides',
    linkName: 'Journal',
    kind: 'hub',
  },
  {
    path: '/directory',
    title: seoTitle('Site Directory'),
    description: seoDescription(
      'Browse every financial professional directory page, including advisors, firms, accountants, specialties, states, and journal articles.'
    ),
    changefreq: 'weekly',
    priority: '0.6',
    h1: 'Site directory',
    linkName: 'Site directory',
    kind: 'hub',
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
    h1: 'List your advisor profile',
    linkName: 'For advisors',
    kind: 'hub',
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
      `select=slug,title,excerpt,content,updated_at,published_at&or=(and(status.eq.published,published_at.is.null),and(status.eq.published,published_at.lte.${new Date().toISOString()}),and(status.eq.scheduled,published_at.lte.${new Date().toISOString()}))&slug=not.is.null&limit=5000`
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
      titleBase: `${a.name}, ${a.position || 'Financial Advisor'}`,
      context: loc || a.firm_name || undefined,
      h1: a.name,
      linkName: a.name,
      kind: 'advisor',
    });
  }

  // Service (specialty) landing pages — every SPA route, including empty ones.
  const serviceCounts = new Map();
  for (const a of advisors) {
    for (const s of a.advisor_services || []) {
      serviceCounts.set(s, (serviceCounts.get(s) || 0) + 1);
    }
  }
  for (const service of [...ALL_SERVICES].sort()) {
    const count = serviceCounts.get(service) || 0;
    pages.push({
      path: `/services/${slugify(service)}`,
      title: seoTitle(`${service} Advisors`),
      description: seoDescription(
        `Find a financial professional for ${service.toLowerCase()}`,
        count > 0
          ? `Compare ${count} vetted fiduciary advisors on credentials, fees, and minimums, then request a free introduction.`
          : 'Compare vetted fiduciary advisors on credentials, fees, and minimums, then request a free introduction.'
      ),
      changefreq: 'weekly',
      priority: '0.8',
      h1: `Find a Financial Professional for ${service}`,
      linkName: service,
      kind: 'service',
      noIndex: count === 0,
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
      h1: `Find a Financial Professional in ${state}`,
      linkName: state,
      kind: 'state',
      noIndex: count === 0,
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
      titleBase: `${a.name}${creds ? `, ${creds}` : ''}`,
      context: loc || a.firm_name || undefined,
      h1: a.name,
      linkName: a.name,
      kind: 'accountant',
    });
  }

  // Accountant specialty pages — every SPA route, including empty ones.
  const specialties = new Set(ACCOUNTANT_SPECIALTIES);
  for (const a of accountants) for (const s of a.client_specialties || []) specialties.add(s);
  const specialtyCounts = new Map();
  for (const a of accountants) {
    for (const s of a.client_specialties || []) {
      specialtyCounts.set(s, (specialtyCounts.get(s) || 0) + 1);
    }
  }
  for (const specialty of [...specialties].sort()) {
    const count = specialtyCounts.get(specialty) || 0;
    pages.push({
      path: `/accountants/specialty/${slugify(specialty)}`,
      title: seoTitle(`Accountants for ${specialty}`),
      description: seoDescription(
        `Find vetted accountants who specialize in ${specialty.toLowerCase()}`,
        'Compare credentials, services, industries served, and pricing before you reach out.'
      ),
      changefreq: 'weekly',
      priority: '0.7',
      h1: `Accountants for ${specialty}`,
      linkName: specialty,
      kind: 'accountant-specialty',
      noIndex: count === 0,
    });
  }

  // Investment firm profiles. Non-advisory asset classes stay reachable but
  // are omitted from the sitemap so they don't compete for crawl budget.
  for (const f of firms) {
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
      h1: `${f.name} Review`,
      linkName: f.name,
      kind: 'firm',
      inSitemap: !NON_ADVISORY_ASSET_CLASSES.has(f.asset_class),
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
      h1: f.name,
      linkName: f.name,
      kind: 'accounting-firm',
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
      h1: p.title,
      linkName: p.title,
      kind: 'article',
    });
  }

  for (const priv of PRIVATE_PAGES) {
    pages.push({
      ...priv,
      h1: priv.title.split(' | ')[0],
      linkName: priv.title.split(' | ')[0],
      kind: 'private',
      inSitemap: false,
    });
  }

  // De-duplicate by canonical path, keeping the first entry.
  const seen = new Set();
  const unique = pages.filter((p) => {
    const key = canonicalPath(p.path);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return finishMetadata(unique);
}

export const isIndexable = (page) => !page.noIndex && page.inSitemap !== false;

const HUB_LINKS = [
  { path: '/', name: 'Home' },
  { path: '/advisors', name: 'Find advisors' },
  { path: '/services', name: 'Browse by specialty' },
  { path: '/financial-professionals', name: 'Browse by state' },
  { path: '/firms', name: 'Investment firms' },
  { path: '/accountants', name: 'Accountants' },
  { path: '/blog', name: 'Journal' },
  { path: '/directory', name: 'Site directory' },
];

const childrenOf = (pages, prefix) =>
  pages
    .filter((p) => isIndexable(p) && p.path.startsWith(`${prefix}/`) && !p.path.slice(prefix.length + 1).includes('/'))
    .map((p) => ({ path: canonicalPath(p.path), name: p.linkName || p.h1 || p.title }));

/** Internal links to embed in prerendered HTML so crawlers can discover URLs without JavaScript. */
export function discoveryLinks(page, pages) {
  const hubs = HUB_LINKS.filter((h) => h.path !== page.path);
  if (page.path === '/') {
    return [
      ...hubs,
      ...childrenOf(pages, '/services'),
      ...childrenOf(pages, '/financial-professionals'),
      ...childrenOf(pages, '/blog'),
    ];
  }
  if (page.path === '/directory') {
    return [
      ...hubs,
      ...childrenOf(pages, '/services'),
      ...childrenOf(pages, '/financial-professionals'),
      ...childrenOf(pages, '/advisors'),
      ...childrenOf(pages, '/firms'),
      ...childrenOf(pages, '/accountants'),
      ...childrenOf(pages, '/accountants/specialty'),
      ...childrenOf(pages, '/blog'),
    ];
  }
  if (page.path === '/advisors') return [...hubs, ...childrenOf(pages, '/advisors'), ...childrenOf(pages, '/services')];
  if (page.path === '/firms') return [...hubs, ...childrenOf(pages, '/firms')];
  if (page.path === '/accountants') {
    return [...hubs, ...childrenOf(pages, '/accountants'), ...childrenOf(pages, '/accountants/specialty')];
  }
  if (page.path === '/blog') return [...hubs, ...childrenOf(pages, '/blog')];
  if (page.path === '/services') return [...hubs, ...childrenOf(pages, '/services')];
  if (page.path === '/financial-professionals') return [...hubs, ...childrenOf(pages, '/financial-professionals')];
  if (page.path === '/accounting-firms') return [...hubs, ...childrenOf(pages, '/accounting-firms')];
  if (page.kind === 'advisor') return hubs.filter((h) => ['/advisors', '/services', '/financial-professionals'].includes(h.path));
  if (page.kind === 'firm') return hubs.filter((h) => ['/firms', '/advisors'].includes(h.path));
  if (page.kind === 'article') return hubs.filter((h) => ['/blog', '/advisors'].includes(h.path));
  return hubs.slice(0, 6);
}

/* ------------------------------------------------- length + uniqueness */

const FILLERS = {
  '/advisors/': [
    'Review this advisor’s specialties, credentials, fee structure, and account minimums.',
    'Request a free introduction through Financial Professional.',
  ],
  '/accountants/': [
    'Review this accountant’s services, industries served, credentials, and pricing.',
    'Request a free introduction through Financial Professional.',
  ],
  '/firms/': [
    'Review the firm’s asset class, fees, liquidity terms, and historical returns.',
    'Compare it with other investment firms on Financial Professional.',
  ],
  '/accounting-firms/': [
    'Review the firm’s services, locations, client types, and engagement minimums.',
    'Compare accounting firms on Financial Professional.',
  ],
  '/blog/': [
    'A plain-English guide from the Financial Professional journal.',
    'Written to help you make a better money decision.',
  ],
  '/': ['Free to search and free to get matched with a vetted fiduciary.'],
};

const SHORT_TAILS = [
  'Free to browse on Financial Professional.',
  'No cost, no obligation.',
  'Updated regularly.',
];

const fillersFor = (path) => {
  for (const prefix of Object.keys(FILLERS)) {
    if (prefix !== '/' && path.startsWith(prefix)) return FILLERS[prefix];
  }
  return FILLERS['/'];
};

function finishMetadata(pages) {
  const titleSeen = new Map();
  const descSeen = new Map();

  for (const page of pages) {
    // Pad short descriptions to the 150-158 character window.
    page.description = seoDescription(page.description, ...fillersFor(page.path), ...SHORT_TAILS);

    const t = page.title;
    const tCount = (titleSeen.get(t) || 0) + 1;
    titleSeen.set(t, tCount);
    if (tCount > 1 && page.context) {
      page.title = seoTitle(`${page.titleBase || t.split(' | ')[0]}, ${page.context}`);
    }

    const d = page.description;
    const dCount = (descSeen.get(d) || 0) + 1;
    descSeen.set(d, dCount);
    if (dCount > 1 && page.context) {
      page.description = seoDescription(`${page.context}: ${d}`, ...fillersFor(page.path), ...SHORT_TAILS);
    }
    delete page.titleBase;
    delete page.context;
  }

  return pages;
}
