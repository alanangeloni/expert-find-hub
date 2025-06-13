
import { generateStaticPages } from '../src/utils/ssg.js';

async function buildSSG() {
  console.log('Starting Static Site Generation...');
  
  try {
    await generateStaticPages();
    console.log('Static Site Generation completed successfully!');
    console.log('Generated pages include:');
    console.log('- Main routes (/, /advisors, /firms, /accounting-firms, /blog)');
    console.log('- Investment firm detail pages (/firms/vanguard, /firms/blackrock, etc.)');
  } catch (error) {
    console.error('Error during Static Site Generation:', error);
    process.exit(1);
  }
}

buildSSG();
