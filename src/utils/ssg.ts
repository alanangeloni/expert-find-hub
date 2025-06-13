
import fs from 'fs';
import path from 'path';

// Mock data services for SSG
const mockInvestmentFirms = [
  {
    id: '1',
    name: 'Edly',
    slug: 'edly',
    description: 'Edly offers income share agreements for students and professionals.',
    minimum_investment: '$500',
    target_return: '8-12%',
    headquarters: 'New York, NY',
    established: '2019'
  },
  {
    id: '2',
    name: 'StockX',
    slug: 'stockx',
    description: 'StockX is a marketplace for sneakers, streetwear, and collectibles.',
    minimum_investment: '$1,000',
    target_return: '10-15%',
    headquarters: 'Detroit, MI',
    established: '2015'
  },
  {
    id: '3',
    name: 'Vanguard',
    slug: 'vanguard',
    description: 'Vanguard is a leading investment management company.',
    minimum_investment: '$3,000',
    target_return: '6-8%',
    headquarters: 'Valley Forge, PA',
    established: '1975'
  }
];

const mockAdvisors = [
  {
    id: '1',
    name: 'John Smith',
    slug: 'john-smith',
    title: 'Senior Financial Advisor',
    location: 'New York, NY',
    specialties: ['Retirement Planning', 'Investment Management']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    slug: 'sarah-johnson', 
    title: 'Wealth Management Specialist',
    location: 'San Francisco, CA',
    specialties: ['Estate Planning', 'Tax Strategy']
  }
];

const mockAccountingFirms = [
  {
    id: '1',
    name: 'Deloitte',
    slug: 'deloitte',
    description: 'Global accounting and consulting firm.',
    location: 'New York, NY',
    services: ['Audit', 'Tax', 'Consulting']
  },
  {
    id: '2',
    name: 'PwC',
    slug: 'pwc',
    description: 'Professional services network.',
    location: 'London, UK',
    services: ['Assurance', 'Tax', 'Advisory']
  }
];

const mockBlogPosts = [
  {
    id: '1',
    title: 'Investment Strategies for 2024',
    slug: 'investment-strategies-2024',
    excerpt: 'Discover the top investment strategies for the upcoming year.',
    content: 'Learn about diversification, risk management, and market trends...',
    published_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Retirement Planning Guide',
    slug: 'retirement-planning-guide',
    excerpt: 'A comprehensive guide to planning for retirement.',
    content: 'Start planning early, understand your options, and maximize savings...',
    published_at: '2024-01-10'
  }
];

// Generate HTML template
const generateHtmlTemplate = (title: string, description: string, content: string): string => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Critical CSS inline -->
    <style>
      body { 
        font-family: system-ui, -apple-system, sans-serif; 
        margin: 0; 
        padding: 0; 
        background-color: #f8fafc;
        line-height: 1.6;
      }
      .ssg-content { 
        padding: 20px; 
        max-width: 1200px; 
        margin: 0 auto; 
        min-height: 200px;
      }
      .ssg-content h1 { 
        font-size: 2.5rem; 
        margin-bottom: 1rem; 
        color: #1e293b; 
        font-weight: 700;
      }
      .ssg-content h2 { 
        font-size: 1.875rem; 
        margin-bottom: 0.75rem; 
        color: #334155; 
        font-weight: 600;
        margin-top: 2rem;
      }
      .ssg-content p { 
        line-height: 1.6; 
        color: #475569; 
        margin-bottom: 1rem; 
        font-size: 1.1rem;
      }
      .ssg-content .meta-info {
        background: #f1f5f9;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
      }
      .ssg-content .meta-info strong {
        color: #1e293b;
      }
      .ssg-loading { 
        text-align: center; 
        padding: 40px; 
        color: #64748b;
        display: none;
      }
      .app-loaded .ssg-content { 
        display: none; 
      }
      .app-loaded .ssg-loading { 
        display: block; 
      }
      #root {
        min-height: 100vh;
      }
    </style>
  </head>
  <body>
    <!-- SSG Content for SEO -->
    <div class="ssg-content">
      ${content}
    </div>
    
    <!-- Loading message for when React takes over -->
    <div class="ssg-loading">Loading interactive content...</div>
    
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
};

// Generate static pages
export const generateStaticPages = async (): Promise<void> => {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Generate homepage
  const homeContent = `
    <h1>Find a Financial Professional</h1>
    <p>Browse financial advisors, investment firms, and accounting professionals to help you achieve your financial goals.</p>
    <h2>Investment Opportunities</h2>
    <p>Discover top-rated investment firms offering diverse portfolio options and competitive returns.</p>
    <h2>Expert Financial Advisors</h2>
    <p>Connect with experienced financial advisors who can guide you through complex financial decisions.</p>
    <h2>Professional Services</h2>
    <p>Access comprehensive accounting and tax services from certified professionals.</p>
  `;
  
  const homeHtml = generateHtmlTemplate(
    'Financial Professional | Find a Financial Professional',
    'Find a Financial Professional to help plan and manage your wealth! Search Financial Advisors, Financial Planners, Insurance Professionals, Tax and Accounting experts, and more.',
    homeContent
  );
  fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml);

  // Generate investment firms listing page
  const firmsContent = `
    <h1>Investment Firms</h1>
    <p>Explore our curated selection of investment firms and find the perfect match for your investment goals.</p>
    <h2>Top Investment Opportunities</h2>
    <p>From traditional asset management to alternative investments, discover firms that align with your financial objectives and risk tolerance.</p>
  `;
  
  const firmsDir = path.join(distDir, 'firms');
  if (!fs.existsSync(firmsDir)) {
    fs.mkdirSync(firmsDir, { recursive: true });
  }
  
  const firmsHtml = generateHtmlTemplate(
    'Investment Firms | Financial Professional',
    'Explore top investment firms and find the perfect match for your investment goals.',
    firmsContent
  );
  fs.writeFileSync(path.join(firmsDir, 'index.html'), firmsHtml);

  // Generate individual firm pages
  for (const firm of mockInvestmentFirms) {
    const firmContent = `
      <h1>${firm.name} Review</h1>
      <p>${firm.description} The minimum investment required on ${firm.name} to open an account is ${firm.minimum_investment}.</p>
      <h2>Investment Details</h2>
      <div class="meta-info">
        <p><strong>Minimum Investment:</strong> ${firm.minimum_investment}</p>
        <p><strong>Target Return:</strong> ${firm.target_return}</p>
        <p><strong>Headquarters:</strong> ${firm.headquarters}</p>
        <p><strong>Established:</strong> ${firm.established}</p>
      </div>
      <h2>About ${firm.name}</h2>
      <p>Learn more about ${firm.name}'s investment approach, fees, and how they can help you achieve your financial goals.</p>
      <h2>Investment Approach</h2>
      <p>Discover the unique investment strategies and methodologies employed by ${firm.name} to deliver returns for their clients.</p>
    `;
    
    const firmDir = path.join(firmsDir, firm.slug);
    if (!fs.existsSync(firmDir)) {
      fs.mkdirSync(firmDir, { recursive: true });
    }
    
    const firmHtml = generateHtmlTemplate(
      `${firm.name} Review | Financial Professional`,
      `${firm.description} The minimum investment required on ${firm.name} to open an account is ${firm.minimum_investment}.`,
      firmContent
    );
    fs.writeFileSync(path.join(firmDir, 'index.html'), firmHtml);
  }

  // Generate advisors listing page
  const advisorsContent = `
    <h1>Financial Advisors</h1>
    <p>Connect with experienced financial advisors who can help you navigate complex financial decisions and plan for your future.</p>
    <h2>Expert Financial Guidance</h2>
    <p>Our network of certified financial advisors offers personalized advice tailored to your unique financial situation and goals.</p>
  `;
  
  const advisorsDir = path.join(distDir, 'advisors');
  if (!fs.existsSync(advisorsDir)) {
    fs.mkdirSync(advisorsDir, { recursive: true });
  }
  
  const advisorsHtml = generateHtmlTemplate(
    'Financial Advisors | Financial Professional',
    'Connect with experienced financial advisors for personalized financial guidance.',
    advisorsContent
  );
  fs.writeFileSync(path.join(advisorsDir, 'index.html'), advisorsHtml);

  // Generate individual advisor pages
  for (const advisor of mockAdvisors) {
    const advisorContent = `
      <h1>${advisor.name} - ${advisor.title}</h1>
      <p>Meet ${advisor.name}, a ${advisor.title} based in ${advisor.location}, specializing in ${advisor.specialties.join(', ')}.</p>
      <h2>Professional Background</h2>
      <div class="meta-info">
        <p><strong>Location:</strong> ${advisor.location}</p>
        <p><strong>Specialties:</strong> ${advisor.specialties.join(', ')}</p>
      </div>
      <h2>Services Offered</h2>
      <p>${advisor.name} provides comprehensive financial planning services to help clients achieve their financial goals.</p>
    `;
    
    const advisorDir = path.join(advisorsDir, advisor.slug);
    if (!fs.existsSync(advisorDir)) {
      fs.mkdirSync(advisorDir, { recursive: true });
    }
    
    const advisorHtml = generateHtmlTemplate(
      `${advisor.name} - ${advisor.title} | Financial Professional`,
      `Meet ${advisor.name}, a ${advisor.title} based in ${advisor.location}.`,
      advisorContent
    );
    fs.writeFileSync(path.join(advisorDir, 'index.html'), advisorHtml);
  }

  // Generate accounting firms listing page
  const accountingContent = `
    <h1>Accounting Firms</h1>
    <p>Find professional accounting services from top-rated firms to handle your business and personal financial needs.</p>
    <h2>Professional Accounting Services</h2>
    <p>From tax preparation to financial audits, our partner accounting firms provide comprehensive services for individuals and businesses.</p>
  `;
  
  const accountingDir = path.join(distDir, 'accounting-firms');
  if (!fs.existsSync(accountingDir)) {
    fs.mkdirSync(accountingDir, { recursive: true });
  }
  
  const accountingHtml = generateHtmlTemplate(
    'Accounting Firms | Financial Professional',
    'Find professional accounting services from top-rated firms.',
    accountingContent
  );
  fs.writeFileSync(path.join(accountingDir, 'index.html'), accountingHtml);

  // Generate individual accounting firm pages
  for (const firm of mockAccountingFirms) {
    const firmContent = `
      <h1>${firm.name} - Professional Accounting Services</h1>
      <p>${firm.description} Based in ${firm.location}, ${firm.name} offers comprehensive accounting services.</p>
      <h2>Services Offered</h2>
      <div class="meta-info">
        <p><strong>Location:</strong> ${firm.location}</p>
        <p><strong>Services:</strong> ${firm.services.join(', ')}</p>
      </div>
      <h2>Why Choose ${firm.name}</h2>
      <p>Learn about ${firm.name}'s expertise and how they can help with your accounting and financial needs.</p>
    `;
    
    const firmDir = path.join(accountingDir, firm.slug);
    if (!fs.existsSync(firmDir)) {
      fs.mkdirSync(firmDir, { recursive: true });
    }
    
    const firmHtml = generateHtmlTemplate(
      `${firm.name} - Professional Accounting Services | Financial Professional`,
      `${firm.description} Based in ${firm.location}.`,
      firmContent
    );
    fs.writeFileSync(path.join(firmDir, 'index.html'), firmHtml);
  }

  // Generate blog listing page
  const blogContent = `
    <h1>Financial Blog</h1>
    <p>Stay informed with the latest financial news, investment strategies, and expert insights from our professional network.</p>
    <h2>Investment Insights</h2>
    <p>Discover expert analysis and strategies to help you make informed investment decisions in today's market.</p>
  `;
  
  const blogDir = path.join(distDir, 'blog');
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }
  
  const blogHtml = generateHtmlTemplate(
    'Financial Blog | Financial Professional',
    'Stay informed with the latest financial news and investment strategies.',
    blogContent
  );
  fs.writeFileSync(path.join(blogDir, 'index.html'), blogHtml);

  // Generate individual blog post pages
  for (const post of mockBlogPosts) {
    const postContent = `
      <h1>${post.title}</h1>
      <p>Published on ${new Date(post.published_at).toLocaleDateString()}</p>
      <p>${post.excerpt}</p>
      <h2>Article Content</h2>
      <p>${post.content}</p>
      <h2>Key Takeaways</h2>
      <p>Learn the essential strategies and insights from this comprehensive guide to financial planning and investment management.</p>
    `;
    
    const postDir = path.join(blogDir, post.slug);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    
    const postHtml = generateHtmlTemplate(
      `${post.title} | Financial Professional`,
      post.excerpt,
      postContent
    );
    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml);
  }

  console.log('✅ Static site generation completed successfully!');
  console.log('Generated static pages for:');
  console.log('- Homepage (/)');
  console.log('- Investment firms listing (/firms)');
  console.log('- Individual firm pages (/firms/[slug])');
  console.log('- Advisors listing (/advisors)');
  console.log('- Individual advisor pages (/advisors/[slug])');
  console.log('- Accounting firms listing (/accounting-firms)');
  console.log('- Individual accounting firm pages (/accounting-firms/[slug])');
  console.log('- Blog listing (/blog)');
  console.log('- Individual blog post pages (/blog/[slug])');
};
