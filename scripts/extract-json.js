const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const FRONTEND_DIR = path.resolve(__dirname, '../../cityedge-frontend');
const OUTPUT_FILE = path.resolve(__dirname, '../client/src/data/site-data.json');

const EXCLUDED_ROUTES = ['hospitality', 'careers', 'visit-us'];

function isExcluded(filePath) {
  return EXCLUDED_ROUTES.some(route => 
    filePath.includes(`\\${route}\\`) || 
    filePath.includes(`/${route}/`) || 
    filePath.endsWith(`\\${route}`) || 
    filePath.endsWith(`/${route}`)
  );
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

function extractProjectData($, route) {
  const isArabic = route.includes('/ar/');
  let rawSlug = route.split('/').pop() || '';
  if (isArabic && rawSlug.endsWith('-ar')) {
    rawSlug = rawSlug.replace('-ar', '');
  }

  const title = $('h1').first().text().trim() || $('title').text().replace('- City Edge Developments', '').trim() || rawSlug;
  const description = $('.elementor-widget-text-editor').first().text().trim();
  
  let heroImage = null;
  // Try to find background image in Elementor section
  const firstSectionStyle = $('.elementor-section').first().attr('style') || '';
  const bgMatch = firstSectionStyle.match(/url\(['"]?(.*?)['"]?\)/);
  if (bgMatch) heroImage = bgMatch[1];
  
  if (!heroImage) {
    heroImage = $('.elementor-section').first().find('img').attr('src') || null;
  }

  const galleries = [];
  $('.gallery img, .elementor-image-gallery img, .swiper-slide img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('data:')) {
      galleries.push(src);
    }
  });

  // Specifically extract HTML blocks to preserve exact DOM structure for project pages
  const sectionsHtml = [];
  $('.elementor-section-wrap > .elementor-section').each((_, el) => {
    sectionsHtml.push($.html(el));
  });

  return {
    slug: rawSlug,
    lang: isArabic ? 'ar' : 'en',
    title,
    description,
    heroImage,
    galleries: [...new Set(galleries)],
    sectionsHtml,
  };
}

function extractStaticPageData($, route) {
  const isArabic = route.includes('/ar/') || route === '/pages/ar/home-ar';
  let rawSlug = route === '/' || route === '/pages/ar/home-ar' ? 'home' : route.split('/').pop() || 'unknown';

  const title = $('title').text().replace('- City Edge Developments', '').trim() || rawSlug;
  
  const sectionsHtml = [];
  $('.elementor-section-wrap > .elementor-section, body > .elementor > .elementor-section').each((_, el) => {
    sectionsHtml.push($.html(el));
  });

  return {
    slug: rawSlug,
    lang: isArabic ? 'ar' : 'en',
    title,
    sectionsHtml,
  };
}

async function runExtraction() {
  console.log('Extracting data from HTML...');
  const allFiles = walk(FRONTEND_DIR);

  const siteData = {
    projects: { en: {}, ar: {} },
    pages: { en: {}, ar: {} },
  };

  for (const file of allFiles) {
    const route = getRoute(file);
    if (isExcluded(route)) continue;

    const html = fs.readFileSync(file, 'utf-8');
    const $ = cheerio.load(html);

    const isProject = route.includes('/project/');
    const isArabic = route.includes('/ar/') || route === '/pages/ar/home-ar';
    const lang = isArabic ? 'ar' : 'en';

    if (isProject) {
      const data = extractProjectData($, route);
      siteData.projects[lang][data.slug] = data;
    } else {
      const data = extractStaticPageData($, route);
      siteData.pages[lang][data.slug] = data;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(siteData, null, 2));
  console.log(`Extraction complete. Saved to ${OUTPUT_FILE}`);
}

runExtraction();
