
import fs from 'fs';
import path from 'path';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
}

const staticUrls: SitemapUrl[] = [
  {
    loc: '/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    loc: '/advisors',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    loc: '/firms',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    loc: '/accounting-firms',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    loc: '/blog',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.8'
  }
];

export const generateSitemap = async (baseUrl = 'https://yoursite.com'): Promise<void> => {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const distDir = path.resolve(process.cwd(), 'dist');
  await fs.promises.writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('Sitemap generated successfully!');
};
