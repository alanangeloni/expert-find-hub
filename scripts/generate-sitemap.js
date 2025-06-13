
import { generateSitemap } from '../src/utils/sitemap.js';

async function buildSitemap() {
  console.log('Generating sitemap...');
  
  try {
    await generateSitemap();
    console.log('Sitemap generation completed successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

buildSitemap();
