const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const FRONTEND_DIR = path.resolve(__dirname, '../../cityedge-frontend');
const OUTPUT_FILE = path.resolve(__dirname, 'audit-report.json');

const EXCLUDED_ROUTES = [
  'hospitality',
  'careers',
  'visit-us'
];

function isExcluded(filePath) {
  return EXCLUDED_ROUTES.some(route => filePath.includes(`\\${route}\\`) || filePath.includes(`/${route}/`) || filePath.endsWith(`\\${route}`) || filePath.endsWith(`/${route}`));
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

function getRoute(filePath) {
  return filePath.replace(FRONTEND_DIR, '').replace(/\\/g, '/').replace(/\/index\.html$/, '') || '/';
}

function extractData(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);

  const images = new Set();
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('data:')) {
      images.add(src);
    }
  });

  const videos = new Set();
  $('video source, video').each((i, el) => {
    const src = $(el).attr('src');
    if (src) videos.add(src);
  });

  const sections = new Set();
  $('section, .elementor-section').each((i, el) => {
    let id = $(el).attr('id');
    let classes = $(el).attr('class');
    if (id || classes) {
       sections.add(`ID: ${id || 'none'} | Classes: ${classes || 'none'}`);
    }
  });
  
  // Specific UI elements
  const forms = $('form').length;
  const sliders = $('.swiper-container, .swiper').length;
  const galleries = $('.gallery, .elementor-image-gallery').length;
  const tabs = $('.elementor-tabs').length;
  const accordions = $('.elementor-accordion').length;

  return {
    images: Array.from(images),
    videos: Array.from(videos),
    sections: Array.from(sections),
    ui: {
      forms,
      sliders,
      galleries,
      tabs,
      accordions
    }
  };
}

async function runAudit() {
  console.log('Starting audit...');
  const allHtmlFiles = walk(FRONTEND_DIR);
  
  const inventory = {
    englishPages: [],
    arabicPages: [],
    englishProjects: [],
    arabicProjects: [],
    excludedPages: [],
    assets: {
      images: new Set(),
      videos: new Set()
    },
    projectStructures: {}
  };

  for (const file of allHtmlFiles) {
    const route = getRoute(file);
    
    if (isExcluded(route)) {
      inventory.excludedPages.push(route);
      continue;
    }

    console.log(`Auditing ${route}...`);
    const data = extractData(file);
    
    data.images.forEach(img => inventory.assets.images.add(img));
    data.videos.forEach(vid => inventory.assets.videos.add(vid));

    const isArabic = route.startsWith('/ar') || route.startsWith('/pages/ar');
    const isProject = route.includes('/project/');

    if (isProject) {
      if (isArabic) {
        inventory.arabicProjects.push(route);
      } else {
        inventory.englishProjects.push(route);
      }
      inventory.projectStructures[route] = {
        totalSections: data.sections.length,
        ui: data.ui
      };
    } else {
      if (isArabic) {
        inventory.arabicPages.push(route);
      } else {
        inventory.englishPages.push(route);
      }
    }
  }

  // Convert Sets to Arrays for JSON
  inventory.assets.images = Array.from(inventory.assets.images);
  inventory.assets.videos = Array.from(inventory.assets.videos);
  inventory.stats = {
    totalImages: inventory.assets.images.length,
    totalVideos: inventory.assets.videos.length,
    totalEnglishProjects: inventory.englishProjects.length,
    totalArabicProjects: inventory.arabicProjects.length
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(inventory, null, 2));
  console.log(`Audit complete. Results saved to ${OUTPUT_FILE}`);
}

runAudit();
