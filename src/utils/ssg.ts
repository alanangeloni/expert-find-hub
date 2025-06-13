
import fs from 'fs';
import path from 'path';
import { firmsData } from '@/data/investmentFirms';

interface PageRoute {
  path: string;
  title: string;
  description: string;
  h1?: string;
  content?: string;
}

const staticRoutes: PageRoute[] = [
  {
    path: '/',
    title: 'Financial Professional | Find a Financial Professional',
    description: 'Find a Financial Professional to help plan and manage your wealth! Search Financial Advisors, Financial Planners, Insurance Professionals, Tax and Accounting experts, and more.',
    h1: 'Find a Financial Professional',
    content: 'Browse financial advisors, investment firms, and accounting professionals to help you achieve your financial goals.'
  },
  {
    path: '/advisors',
    title: 'Find a Financial Advisor',
    description: 'Browse financial advisors to find the one best suited to help you achieve your financial goals',
    h1: 'Find a Financial Advisor',
    content: 'Connect with qualified financial advisors who can help you plan for your financial future.'
  },
  {
    path: '/firms',
    title: 'Investment Firms | Financial Professional - Browse 200+ Investment Firms',
    description: 'Browse and compare over 200 investment firms! Find investments in Stocks, Real Estate, Loans, Collectibles, Wine, Start-ups, Crypto, and more.',
    h1: 'Investment Firms',
    content: 'Browse and compare investment firms across different asset classes and investment strategies.'
  },
  {
    path: '/accounting-firms',
    title: 'Accounting Firms',
    description: 'Find trusted accounting firms and tax professionals for your business and personal needs',
    h1: 'Accounting Firms',
    content: 'Find trusted accounting firms and tax professionals for comprehensive financial services.'
  },
  {
    path: '/blog',
    title: 'Financial Blog | Expert Insights',
    description: 'Stay informed with expert financial insights, tips, and industry news from trusted professionals',
    h1: 'Financial Blog',
    content: 'Expert financial insights, tips, and industry news to help you make informed decisions.'
  }
];

// Generate firm detail pages
const generateFirmDetailRoutes = (): PageRoute[] => {
  const firmRoutes: PageRoute[] = [];
  
  Object.entries(firmsData).forEach(([slug, firm]) => {
    const pageTitle = `${firm.name} Review`;
    const pageDescription = `${firm.description || ''} The minimum investment required on ${firm.name} to open an account is ${firm.minimumInvestment || 'not specified'}.`;
    
    firmRoutes.push({
      path: `/firms/${slug}`,
      title: pageTitle,
      description: pageDescription,
      h1: firm.name,
      content: `${firm.description || ''} Founded in ${firm.founded || 'N/A'}, ${firm.name} is headquartered in ${firm.headquarters || 'N/A'} with ${firm.aum || 'N/A'} in assets under management. The minimum investment is ${firm.minimumInvestment || 'not specified'} with a target return of ${firm.targetReturn || 'not specified'}.`
    });
  });
  
  return firmRoutes;
};

export const generateStaticPages = async (): Promise<void> => {
  const distDir = path.resolve(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    await fs.promises.mkdir(distDir, { recursive: true });
  }

  // Combine static routes with dynamic firm routes
  const allRoutes = [...staticRoutes, ...generateFirmDetailRoutes()];

  for (const route of allRoutes) {
    try {
      // Create the full HTML document with proper SEO tags and content
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
    
    <!-- Critical CSS inline would go here -->
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }
      .ssg-content { padding: 20px; max-width: 1200px; margin: 0 auto; }
      .ssg-content h1 { font-size: 2rem; margin-bottom: 1rem; color: #1e293b; }
      .ssg-content p { line-height: 1.6; color: #475569; margin-bottom: 1rem; }
      .ssg-loading { display: none; }
      .app-loaded .ssg-content { display: none; }
    </style>
  </head>
  <body>
    <!-- SSG Content for SEO -->
    <div class="ssg-content">
      ${route.h1 ? `<h1>${route.h1}</h1>` : ''}
      ${route.content ? `<p>${route.content}</p>` : ''}
      <div class="ssg-loading">Loading...</div>
    </div>
    
    <!-- React App Root -->
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    
    <!-- Script to hide SSG content when React loads -->
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
          document.body.classList.add('app-loaded');
        }, 100);
      });
    </script>
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
