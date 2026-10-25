import { absoluteUrl, htmlEscape } from './seo-lib.mjs';

// Replace template and previously injected tags with one route-owned set.
export function applyHead(template, page) {
  const url = absoluteUrl(page.path);
  const fields = {
    description: page.description,
    'og:url': url,
    'og:title': page.title,
    'og:description': page.description,
    'og:type': page.ogType || 'website',
    'twitter:title': page.title,
    'twitter:description': page.description,
  };
  let html = template
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<link\b[^>]*>/gi, (tag) => /\brel\s*=\s*["']canonical["']/i.test(tag) ? '' : tag)
    .replace(/<meta\b[^>]*>/gi, (tag) => {
      const key = tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i)?.[1];
      return key && Object.hasOwn(fields, key.toLowerCase()) ? '' : tag;
    });
  const tags = [
    `<title>${htmlEscape(page.title)}</title>`,
    `<link rel="canonical" href="${htmlEscape(url)}" />`,
    ...Object.entries(fields).map(([key, value]) =>
      `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${htmlEscape(value)}" />`
    ),
  ];
  return html.replace('</head>', `${tags.join('\n')}\n</head>`);
}