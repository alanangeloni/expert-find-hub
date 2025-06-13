
import { generateStaticPages } from '../src/utils/ssg.js';

async function buildSSG() {
  console.log('Starting Static Site Generation...');
  
  try {
    await generateStaticPages();
    console.log('Static Site Generation completed successfully!');
    console.log('Generated comprehensive static pages for:');
    console.log('- All main routes (/, /advisors, /firms, /accounting-firms, /blog)');
    console.log('- Individual firm detail pages (/firms/stockx, /firms/vanguard, etc.)');
    console.log('- Individual advisor profile pages (/advisors/john-smith, etc.)');
    console.log('- Individual accounting firm pages (/accounting-firms/deloitte, etc.)');
    console.log('- Individual blog post pages (/blog/investment-strategies-2024, etc.)');
    console.log('\nAll pages now include proper H1/H2 headings and content for SEO!');
  } catch (error) {
    console.error('Error during Static Site Generation:', error);
    process.exit(1);
  }
}

buildSSG();
