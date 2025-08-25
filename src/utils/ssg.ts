
import fs from 'fs';
import path from 'path';
import { supabase } from '@/integrations/supabase/client';

// Get the base HTML template
const getBaseHtml = () => {
  const indexPath = path.join(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    return fs.readFileSync(indexPath, 'utf-8');
  }
  
  // Fallback template if index.html doesn't exist yet
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>__TITLE__</title>
    <meta name="description" content="__DESCRIPTION__" />
    
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
    </style>
  </head>
  <body>
    <!-- SSG Content for SEO -->
    <div class="ssg-content">
      __CONTENT__
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
};

// Create HTML with specific title, description, and content
const createHtml = (title: string, description: string, content: string) => {
  const baseHtml = getBaseHtml();
  return baseHtml
    .replace('__TITLE__', title)
    .replace('__DESCRIPTION__', description)
    .replace('__CONTENT__', content);
};

// Ensure directory exists
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Generate homepage (don't overwrite main index.html for SPA routing)
const generateHomepage = () => {
  console.log('Skipping homepage generation to preserve SPA routing...');
  console.log('✅ Homepage preserved for client-side routing');
};

// Generate investment firms listing page
const generateFirmsPage = () => {
  console.log('Generating /firms page...');
  
  const title = 'Investment Firms | Financial Professional - Browse 200+ Investment Firms';
  const description = 'Browse and compare over 200 investment firms! Find investments in Stocks, Real Estate, Loans, Collectibles, Wine, Start-ups, Crypto, and more.';
  const content = `
    <h1>Investment Firms</h1>
    <h2>Browse 200+ Investment Firms</h2>
    <p>Browse and compare over 200 investment firms! Find investments in Stocks, Real Estate, Loans, Collectibles, Wine, Start-ups, Crypto, and more.</p>
  `;
  
  const firmsDir = path.join(process.cwd(), 'dist', 'firms');
  ensureDir(firmsDir);
  
  const html = createHtml(title, description, content);
  fs.writeFileSync(path.join(firmsDir, 'index.html'), html);
  console.log('✅ /firms page generated');
};

// Generate individual firm pages
const generateFirmPages = async () => {
  try {
    console.log('Generating individual firm pages...');
    
    const { data: firms, error } = await supabase
      .from('investment_firms')
      .select('id, name, slug, description, minimum_investment');
    
    if (error) {
      console.error('Error fetching firms:', error);
      return;
    }
    
    if (!firms || firms.length === 0) {
      console.log('No firms found');
      return;
    }
    
    const firmsDir = path.join(process.cwd(), 'dist', 'firms');
    ensureDir(firmsDir);
    
    for (const firm of firms) {
      const title = `${firm.name} Review`;
      const description = `${firm.description || ''} The minimum investment required on ${firm.name} to open an account is ${firm.minimum_investment || 'not specified'}.`;
      const content = `
        <h1>${firm.name} Review</h1>
        <h2>Investment Details</h2>
        <p>${firm.description || `Learn more about ${firm.name} and their investment opportunities.`}</p>
        <p>The minimum investment required on ${firm.name} to open an account is ${firm.minimum_investment || 'not specified'}.</p>
      `;
      
      const firmDir = path.join(firmsDir, firm.slug);
      ensureDir(firmDir);
      
      const html = createHtml(title, description, content);
      fs.writeFileSync(path.join(firmDir, 'index.html'), html);
      console.log(`✅ Firm page generated: /firms/${firm.slug}`);
    }
  } catch (error) {
    console.error('Error generating firm pages:', error);
  }
};

// Generate advisors listing page
const generateAdvisorsPage = () => {
  console.log('Generating /advisors page...');
  
  const title = 'Find a Financial Advisor';
  const description = 'Browse financial advisors to find the one best suited to help you achieve your financial goals';
  const content = `
    <h1>Find a Financial Advisor</h1>
    <h2>Browse Financial Advisors</h2>
    <p>Browse financial advisors to find the one best suited to help you achieve your financial goals.</p>
  `;
  
  const advisorsDir = path.join(process.cwd(), 'dist', 'advisors');
  ensureDir(advisorsDir);
  
  const html = createHtml(title, description, content);
  fs.writeFileSync(path.join(advisorsDir, 'index.html'), html);
  console.log('✅ /advisors page generated');
};

// Generate individual advisor pages
const generateAdvisorPages = async () => {
  try {
    console.log('Generating individual advisor pages...');
    
    const { data: advisors, error } = await supabase
      .from('financial_advisors')
      .select('id, name, slug, position, firm_name, personal_bio')
      .not('approved_at', 'is', null);
    
    if (error) {
      console.error('Error fetching advisors:', error);
      return;
    }
    
    if (!advisors || advisors.length === 0) {
      console.log('No advisors found');
      return;
    }
    
    const advisorsDir = path.join(process.cwd(), 'dist', 'advisors');
    ensureDir(advisorsDir);
    
    for (const advisor of advisors) {
      const title = advisor.name;
      const description = `${advisor.position || 'Financial Advisor'} at ${advisor.firm_name || 'Independent'}. ${advisor.personal_bio || `Learn more about ${advisor.name} and their financial advisory services.`}`;
      const content = `
        <h1>${advisor.name}</h1>
        <h2>${advisor.position || 'Financial Advisor'}</h2>
        <p>${advisor.position || 'Financial Advisor'} at ${advisor.firm_name || 'Independent'}.</p>
        <p>${advisor.personal_bio || `Learn more about ${advisor.name} and their financial advisory services.`}</p>
      `;
      
      const advisorDir = path.join(advisorsDir, advisor.slug);
      ensureDir(advisorDir);
      
      const html = createHtml(title, description, content);
      fs.writeFileSync(path.join(advisorDir, 'index.html'), html);
      console.log(`✅ Advisor page generated: /advisors/${advisor.slug}`);
    }
  } catch (error) {
    console.error('Error generating advisor pages:', error);
  }
};

// Generate accounting firms listing page
const generateAccountingFirmsPage = () => {
  console.log('Generating /accounting-firms page...');
  
  const title = 'Accounting Firms | Financial Professional';
  const description = 'Browse accounting firms to find professional tax and accounting services for your business and personal needs.';
  const content = `
    <h1>Accounting Firms</h1>
    <h2>Professional Tax and Accounting Services</h2>
    <p>Browse accounting firms to find professional tax and accounting services for your business and personal needs.</p>
  `;
  
  const accountingDir = path.join(process.cwd(), 'dist', 'accounting-firms');
  ensureDir(accountingDir);
  
  const html = createHtml(title, description, content);
  fs.writeFileSync(path.join(accountingDir, 'index.html'), html);
  console.log('✅ /accounting-firms page generated');
};

// Generate individual accounting firm pages
const generateAccountingFirmPages = async () => {
  try {
    console.log('Generating individual accounting firm pages...');
    
    const { data: firms, error } = await supabase
      .from('accounting_firms')
      .select('id, name, slug, description');
    
    if (error) {
      console.error('Error fetching accounting firms:', error);
      return;
    }
    
    if (!firms || firms.length === 0) {
      console.log('No accounting firms found');
      return;
    }
    
    const accountingDir = path.join(process.cwd(), 'dist', 'accounting-firms');
    ensureDir(accountingDir);
    
    for (const firm of firms) {
      const title = `${firm.name} - Accounting Services`;
      const description = firm.description || `Professional accounting and tax services from ${firm.name}. Get expert financial guidance for your business and personal needs.`;
      const content = `
        <h1>${firm.name}</h1>
        <h2>Professional Accounting Services</h2>
        <p>${firm.description || `Professional accounting and tax services from ${firm.name}.`}</p>
        <p>Get expert financial guidance for your business and personal needs.</p>
      `;
      
      const firmDir = path.join(accountingDir, firm.slug);
      ensureDir(firmDir);
      
      const html = createHtml(title, description, content);
      fs.writeFileSync(path.join(firmDir, 'index.html'), html);
      console.log(`✅ Accounting firm page generated: /accounting-firms/${firm.slug}`);
    }
  } catch (error) {
    console.error('Error generating accounting firm pages:', error);
  }
};

// Generate blog listing page
const generateBlogPage = () => {
  console.log('Generating /blog page...');
  
  const title = 'Blog | Financial Professional - Increase Your Financial IQ in Minutes!';
  const description = 'Read the latest financial articles! Learn more about investing, retirement, saving, insurance, and more.';
  const content = `
    <h1>Financial Blog</h1>
    <h2>Increase Your Financial IQ in Minutes!</h2>
    <p>Read the latest financial articles! Learn more about investing, retirement, saving, insurance, and more.</p>
  `;
  
  const blogDir = path.join(process.cwd(), 'dist', 'blog');
  ensureDir(blogDir);
  
  const html = createHtml(title, description, content);
  fs.writeFileSync(path.join(blogDir, 'index.html'), html);
  console.log('✅ /blog page generated');
};

// Generate individual blog post pages
const generateBlogPostPages = async () => {
  try {
    console.log('Generating individual blog post pages...');
    
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, content')
      .eq('status', 'published');
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return;
    }
    
    if (!posts || posts.length === 0) {
      console.log('No published blog posts found');
      return;
    }
    
    const blogDir = path.join(process.cwd(), 'dist', 'blog');
    ensureDir(blogDir);
    
    for (const post of posts) {
      const title = post.title;
      const description = post.excerpt || post.content?.substring(0, 160) || `Read this financial article: ${post.title}`;
      const content = `
        <h1>${post.title}</h1>
        <h2>Financial Insights</h2>
        <p>${post.excerpt || 'Read this comprehensive financial article to enhance your financial knowledge.'}</p>
      `;
      
      const postDir = path.join(blogDir, post.slug);
      ensureDir(postDir);
      
      const html = createHtml(title, description, content);
      fs.writeFileSync(path.join(postDir, 'index.html'), html);
      console.log(`✅ Blog post page generated: /blog/${post.slug}`);
    }
  } catch (error) {
    console.error('Error generating blog post pages:', error);
  }
};

// Main function to generate all static pages
export const generateStaticPages = async () => {
  try {
    console.log('🚀 Starting Static Site Generation...');
    
    // Ensure dist directory exists
    const distDir = path.join(process.cwd(), 'dist');
    ensureDir(distDir);
    
    // Generate all pages
    generateHomepage();
    generateFirmsPage();
    await generateFirmPages();
    generateAdvisorsPage();
    await generateAdvisorPages();
    generateAccountingFirmsPage();
    await generateAccountingFirmPages();
    generateBlogPage();
    await generateBlogPostPages();
    
    console.log('✅ Static Site Generation completed successfully!');
  } catch (error) {
    console.error('❌ Error during Static Site Generation:', error);
    throw error;
  }
};
