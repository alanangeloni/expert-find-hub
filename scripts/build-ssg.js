
import { generateStaticPages } from '../src/utils/ssg.js';

async function buildSSG() {
  console.log('🚀 Starting Static Site Generation...');
  
  try {
    await generateStaticPages();
    console.log('✅ Static Site Generation completed successfully!');
    console.log('\n📁 Generated static HTML files with proper H1/H2 headings and content for:');
    console.log('   • Homepage (/)');
    console.log('   • Investment firms (/firms and /firms/[slug])');
    console.log('   • Financial advisors (/advisors and /advisors/[slug])');
    console.log('   • Accounting firms (/accounting-firms and /accounting-firms/[slug])');
    console.log('   • Blog (/blog and /blog/[slug])');
    console.log('\n🔍 All pages now include:');
    console.log('   • Proper H1 and H2 headings');
    console.log('   • Rich page content');
    console.log('   • SEO meta tags');
    console.log('   • Static HTML for search engine crawlers');
    console.log('\n⚡ Pages will hydrate with React for interactive functionality');
  } catch (error) {
    console.error('❌ Error during Static Site Generation:', error);
    process.exit(1);
  }
}

buildSSG();
