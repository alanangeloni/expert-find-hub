
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data for SSG - in a real app this would come from your data source
const getStaticData = async () => {
  // This would typically fetch from your actual data source
  return {
    firms: [
      { slug: 'stockx', name: 'StockX', description: 'Investment platform for alternative assets' },
      { slug: 'vanguard', name: 'Vanguard', description: 'Low-cost index funds and ETFs' },
      { slug: 'blackrock', name: 'BlackRock', description: 'Global investment management' },
      { slug: 'fidelity', name: 'Fidelity', description: 'Full-service investment firm' }
    ],
    advisors: [
      { slug: 'john-smith', name: 'John Smith', description: 'Certified Financial Planner' },
      { slug: 'jane-doe', name: 'Jane Doe', description: 'Investment Advisor' }
    ],
    accountingFirms: [
      { slug: 'deloitte', name: 'Deloitte', description: 'Global accounting and consulting' },
      { slug: 'pwc', name: 'PwC', description: 'Professional services firm' }
    ],
    blogPosts: [
      { slug: 'investment-strategies-2024', title: 'Investment Strategies for 2024', excerpt: 'Learn about the best investment strategies for the new year' },
      { slug: 'retirement-planning-guide', title: 'Complete Retirement Planning Guide', excerpt: 'Everything you need to know about planning for retirement' }
    ]
  };
};

const generatePageHTML = (title: string, description: string, content: string, canonicalUrl?: string) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}" />` : ''}
    
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
        font-size: 2rem; 
        margin-bottom: 1rem; 
        color: #1e293b; 
        font-weight: 700;
      }
      .ssg-content h2 { 
        font-size: 1.5rem; 
        margin-bottom: 0.75rem; 
        color: #334155; 
        font-weight: 600;
      }
      .ssg-content p { 
        line-height: 1.6; 
        color: #475569; 
        margin-bottom: 1rem; 
        font-size: 1.1rem;
      }
      .ssg-loading { 
        text-align: center; 
        padding: 40px; 
        color: #64748b;
      }
      .app-loaded .ssg-content { 
        display: none; 
      }
      #root {
        min-height: 100vh;
      }
      .firm-grid, .advisor-grid, .blog-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      .card {
        background: white;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border: 1px solid #e2e8f0;
      }
      .card h3 {
        margin: 0 0 0.5rem 0;
        color: #1e293b;
        font-size: 1.25rem;
      }
      .card p {
        margin: 0;
        color: #64748b;
        font-size: 0.875rem;
      }
    </style>
  </head>
  <body>
    <!-- SSG Content for SEO -->
    <div class="ssg-content">
      ${content}
      <div class="ssg-loading">Loading interactive content...</div>
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
};

export const generateStaticPages = async () => {
  const data = await getStaticData();
  const distDir = path.resolve(__dirname, '../../dist');
  
  // Ensure dist directory exists
  await fs.mkdir(distDir, { recursive: true });

  // Generate homepage
  const homepageContent = `
    <h1>Find a Financial Professional</h1>
    <p>Browse financial advisors, investment firms, and accounting professionals to help you achieve your financial goals.</p>
    <h2>Featured Services</h2>
    <p>Our platform connects you with verified financial professionals across various specialties including investment management, financial planning, tax preparation, and more.</p>
  `;
  
  await fs.writeFile(
    path.join(distDir, 'index.html'),
    generatePageHTML(
      'Financial Professional | Find a Financial Professional',
      'Find a Financial Professional to help plan and manage your wealth! Search Financial Advisors, Financial Planners, Insurance Professionals, Tax and Accounting experts, and more.',
      homepageContent,
      'https://yoursite.com/'
    )
  );

  // Generate advisors page
  const advisorsContent = `
    <h1>Financial Advisors Directory</h1>
    <p>Find qualified financial advisors to help you with investment planning, retirement strategies, and wealth management.</p>
    <h2>Featured Financial Advisors</h2>
    <div class="advisor-grid">
      ${data.advisors.map(advisor => `
        <div class="card">
          <h3>${advisor.name}</h3>
          <p>${advisor.description}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  await fs.mkdir(path.join(distDir, 'advisors'), { recursive: true });
  await fs.writeFile(
    path.join(distDir, 'advisors', 'index.html'),
    generatePageHTML(
      'Financial Advisors Directory | Find Certified Financial Planners',
      'Browse our directory of qualified financial advisors and certified financial planners. Find professionals who can help with investment planning, retirement strategies, and wealth management.',
      advisorsContent,
      'https://yoursite.com/advisors'
    )
  );

  // Generate investment firms page
  const firmsContent = `
    <h1>Investment Firms Directory</h1>
    <p>Explore top investment firms and platforms to help grow and manage your investments.</p>
    <h2>Featured Investment Firms</h2>
    <div class="firm-grid">
      ${data.firms.map(firm => `
        <div class="card">
          <h3>${firm.name}</h3>
          <p>${firm.description}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  await fs.mkdir(path.join(distDir, 'firms'), { recursive: true });
  await fs.writeFile(
    path.join(distDir, 'firms', 'index.html'),
    generatePageHTML(
      'Investment Firms Directory | Top Investment Platforms',
      'Discover leading investment firms and platforms. Compare features, fees, and services to find the right investment solution for your financial goals.',
      firmsContent,
      'https://yoursite.com/firms'
    )
  );

  // Generate individual firm detail pages
  for (const firm of data.firms) {
    const firmContent = `
      <h1>${firm.name} Review</h1>
      <p>${firm.description} The minimum investment required on ${firm.name} to open an account varies by account type.</p>
      <h2>About ${firm.name}</h2>
      <p>Learn more about ${firm.name}'s investment approach, fees, and services to determine if it's the right fit for your investment goals.</p>
      <h2>Key Features</h2>
      <p>Explore the key features and benefits that ${firm.name} offers to investors and how they can help you achieve your financial objectives.</p>
    `;
    
    await fs.writeFile(
      path.join(distDir, 'firms', `${firm.slug}.html`),
      generatePageHTML(
        `${firm.name} Review | Investment Firm Analysis`,
        `${firm.description} The minimum investment required on ${firm.name} to open an account varies by account type.`,
        firmContent,
        `https://yoursite.com/firms/${firm.slug}`
      )
    );
  }

  // Generate accounting firms page
  const accountingContent = `
    <h1>Accounting Firms Directory</h1>
    <p>Find qualified accounting firms and tax professionals to help with tax preparation, business accounting, and financial compliance.</p>
    <h2>Featured Accounting Firms</h2>
    <div class="firm-grid">
      ${data.accountingFirms.map(firm => `
        <div class="card">
          <h3>${firm.name}</h3>
          <p>${firm.description}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  await fs.mkdir(path.join(distDir, 'accounting-firms'), { recursive: true });
  await fs.writeFile(
    path.join(distDir, 'accounting-firms', 'index.html'),
    generatePageHTML(
      'Accounting Firms Directory | Tax and Business Services',
      'Find qualified accounting firms and tax professionals. Get help with tax preparation, business accounting, auditing, and financial compliance services.',
      accountingContent,
      'https://yoursite.com/accounting-firms'
    )
  );

  // Generate individual accounting firm pages
  for (const firm of data.accountingFirms) {
    const firmContent = `
      <h1>${firm.name} Review</h1>
      <p>${firm.description} Learn about their services, expertise, and how they can help with your accounting and tax needs.</p>
      <h2>About ${firm.name}</h2>
      <p>Discover ${firm.name}'s range of accounting services, from tax preparation to business consulting and financial advisory services.</p>
      <h2>Services Offered</h2>
      <p>Explore the comprehensive accounting and tax services that ${firm.name} provides to individuals and businesses.</p>
    `;
    
    await fs.mkdir(path.join(distDir, 'accounting-firms'), { recursive: true });
    await fs.writeFile(
      path.join(distDir, 'accounting-firms', `${firm.slug}.html`),
      generatePageHTML(
        `${firm.name} Review | Accounting Firm Analysis`,
        `${firm.description} Learn about their services, expertise, and how they can help with your accounting and tax needs.`,
        firmContent,
        `https://yoursite.com/accounting-firms/${firm.slug}`
      )
    );
  }

  // Generate blog page
  const blogContent = `
    <h1>Financial Planning Blog</h1>
    <p>Stay informed with the latest insights on financial planning, investment strategies, and wealth management.</p>
    <h2>Recent Articles</h2>
    <div class="blog-grid">
      ${data.blogPosts.map(post => `
        <div class="card">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  await fs.mkdir(path.join(distDir, 'blog'), { recursive: true });
  await fs.writeFile(
    path.join(distDir, 'blog', 'index.html'),
    generatePageHTML(
      'Financial Planning Blog | Investment Insights and Tips',
      'Stay informed with expert insights on financial planning, investment strategies, retirement planning, and wealth management from industry professionals.',
      blogContent,
      'https://yoursite.com/blog'
    )
  );

  // Generate individual blog post pages
  for (const post of data.blogPosts) {
    const postContent = `
      <h1>${post.title}</h1>
      <p>${post.excerpt}</p>
      <h2>Key Takeaways</h2>
      <p>This comprehensive guide covers essential strategies and insights to help you make informed financial decisions.</p>
      <h2>Expert Analysis</h2>
      <p>Our financial experts break down complex concepts into actionable advice you can implement in your financial planning journey.</p>
    `;
    
    await fs.writeFile(
      path.join(distDir, 'blog', `${post.slug}.html`),
      generatePageHTML(
        `${post.title} | Financial Planning Blog`,
        post.excerpt,
        postContent,
        `https://yoursite.com/blog/${post.slug}`
      )
    );
  }

  // Generate individual advisor pages
  for (const advisor of data.advisors) {
    const advisorContent = `
      <h1>${advisor.name} - Financial Advisor</h1>
      <p>${advisor.description} Schedule a consultation to discuss your financial goals and investment strategies.</p>
      <h2>About ${advisor.name}</h2>
      <p>Learn about ${advisor.name}'s background, expertise, and approach to financial planning and investment management.</p>
      <h2>Services Offered</h2>
      <p>Discover the range of financial planning and investment services that ${advisor.name} provides to help clients achieve their financial goals.</p>
    `;
    
    await fs.mkdir(path.join(distDir, 'advisors'), { recursive: true });
    await fs.writeFile(
      path.join(distDir, 'advisors', `${advisor.slug}.html`),
      generatePageHTML(
        `${advisor.name} - Financial Advisor | Professional Profile`,
        `${advisor.description} Schedule a consultation to discuss your financial goals and investment strategies.`,
        advisorContent,
        `https://yoursite.com/advisors/${advisor.slug}`
      )
    );
  }

  console.log('✅ Static site generation completed successfully!');
  console.log('Generated pages:');
  console.log('- Homepage (/)');
  console.log('- Advisors directory (/advisors)');
  console.log('- Investment firms directory (/firms)');
  console.log('- Accounting firms directory (/accounting-firms)');
  console.log('- Blog (/blog)');
  console.log(`- ${data.firms.length} individual investment firm pages`);
  console.log(`- ${data.advisors.length} individual advisor pages`);
  console.log(`- ${data.accountingFirms.length} individual accounting firm pages`);
  console.log(`- ${data.blogPosts.length} individual blog post pages`);
};
