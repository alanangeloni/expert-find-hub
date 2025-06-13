
import { generateStaticPages } from '../src/utils/ssg.js';

async function buildSSG() {
  console.log('Starting Static Site Generation...');
  
  try {
    await generateStaticPages();
    console.log('Static Site Generation completed successfully!');
  } catch (error) {
    console.error('Error during Static Site Generation:', error);
    process.exit(1);
  }
}

buildSSG();
