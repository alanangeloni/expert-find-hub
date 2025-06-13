
import fs from 'fs';
import path from 'path';

interface PageRoute {
  path: string;
  title: string;
  description: string;
}

const staticRoutes: PageRoute[] = [
  {
    path: '/',
    title: 'Financial Professional | Find a Financial Professional',
    description: 'Find a Financial Professional to help plan and manage your wealth! Search Financial Advisors, Financial Planners, Insurance Professionals, Tax and Accounting experts, and more.'
  },
  {
    path: '/advisors',
    title: 'Find a Financial Advisor',
    description: 'Browse financial advisors to find the one best suited to help you achieve your financial goals'
  },
  {
    path: '/firms',
    title: 'Investment Firms | Financial Professional - Browse 200+ Investment Firms',
    description: 'Browse and compare over 200 investment firms! Find investments in Stocks, Real Estate, Loans, Collectibles, Wine, Start-ups, Crypto, and more.'
  },
  {
    path: '/accounting-firms',
    title: 'Accounting Firms',
    description: 'Find trusted accounting firms and tax professionals for your business and personal needs'
  },
  {
    path: '/blog',
    title: 'Financial Blog | Expert Insights',
    description: 'Stay informed with expert financial insights, tips, and industry news from trusted professionals'
  }
];

export const generateStaticPages = async (): Promise<void> => {
  const distDir = path.resolve(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    await fs.promises.mkdir(distDir, { recursive: true });
  }

  for (const route of staticRoutes) {
    try {
      // Create the full HTML document with proper SEO tags
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <meta name="author" content="Financial Professional" />
    
    <!-- Open Graph tags -->
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yoursite.com${route.path}" />
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://yoursite.com${route.path}" />
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

      // Determine the file path
      let filePath: string;
      if (route.path === '/') {
        filePath = path.join(distDir, 'index.html');
      } else {
        const routeDir = path.join(distDir, route.path);
        await fs.promises.mkdir(routeDir, { recursive: true });
        filePath = path.join(routeDir, 'index.html');
      }

      // Write the HTML file
      await fs.promises.writeFile(filePath, fullHtml, 'utf-8');
      console.log(`Generated static page: ${route.path}`);
    } catch (error) {
      console.error(`Error generating static page for ${route.path}:`, error);
    }
  }
};

export { staticRoutes };
