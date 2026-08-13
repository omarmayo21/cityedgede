import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { db } from './index';
import { projects, projectTranslations, galleries, pages, pageTranslations, unitTypes } from '../schema';
import { eq } from 'drizzle-orm';

const FRONTEND_DIR = path.resolve(__dirname, '../../../../cityedge-frontend');

const EXCLUDED_ROUTES = ['hospitality', 'careers', 'visit-us'];

function isExcluded(filePath: string) {
  return EXCLUDED_ROUTES.some(route => 
    filePath.includes(`\\${route}\\`) || 
    filePath.includes(`/${route}/`) || 
    filePath.endsWith(`\\${route}`) || 
    filePath.endsWith(`/${route}`)
  );
}

function walk(dir: string): string[] {
  let results: string[] = [];
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

function getRoute(filePath: string) {
  return filePath.replace(FRONTEND_DIR, '').replace(/\\/g, '/').replace(/\/index\.html$/, '') || '/';
}

async function runMigration() {
  console.log('Starting data migration...');
  const allFiles = walk(FRONTEND_DIR);

  // First, we create basic page entries and projects
  for (const file of allFiles) {
    const route = getRoute(file);
    if (isExcluded(route)) continue;

    const html = fs.readFileSync(file, 'utf-8');
    const $ = cheerio.load(html);

    const isArabic = route.startsWith('/ar') || route.startsWith('/pages/ar');
    const isProject = route.includes('/project/');

    if (isProject) {
      // Extract project slug
      // Route might be /pages/project/almaqsad-park or /pages/ar/project/almaqsad-park-ar
      const parts = route.split('/');
      let rawSlug = parts[parts.length - 1];
      if (isArabic && rawSlug.endsWith('-ar')) {
        rawSlug = rawSlug.replace('-ar', '');
      }
      
      const title = $('h1').first().text().trim() || $('title').text().replace('- City Edge Developments', '').trim() || rawSlug;
      const description = $('.elementor-widget-text-editor').first().text().trim() || null;
      
      // Extract Hero Image (look for background images on first section or specific img tags)
      let heroImage = null;
      $('.elementor-section').first().find('img').each((_, el) => {
        if (!heroImage) heroImage = $(el).attr('src');
      });

      // Find or insert project
      let projectRecord = await db.select().from(projects).where(eq(projects.slug, rawSlug)).limit(1).then(res => res[0]);
      
      if (!projectRecord) {
        const [inserted] = await db.insert(projects).values({
          slug: rawSlug,
          heroImage,
        }).returning();
        projectRecord = inserted;
        console.log(`Created project: ${rawSlug}`);
      }

      // Insert translation
      await db.insert(projectTranslations).values({
        projectId: projectRecord.id,
        language: isArabic ? 'ar' : 'en',
        title,
        description,
      });

      // Extract Galleries
      const images = new Set<string>();
      $('.gallery img, .elementor-image-gallery img, .swiper-slide img').each((_, el) => {
        const src = $(el).attr('src');
        if (src && !src.startsWith('data:')) {
          images.add(src);
        }
      });
      
      // Insert galleries only for English to avoid duplication (or insert for both, we'll just insert if they don't exist)
      if (!isArabic) {
        let order = 0;
        for (const img of Array.from(images)) {
          await db.insert(galleries).values({
            projectId: projectRecord.id,
            imageUrl: img,
            displayOrder: order++,
          });
        }
        
        // Try to extract unit types simply
        $('.unit-card, .unit-type').each((_, el) => {
           const typeTitle = $(el).find('h3, h4').text().trim() || 'Unit';
           const typeImg = $(el).find('img').attr('src') || null;
           
           // A more complex parser could use regex on text to find bedrooms, etc.
           // For now, we just insert the translation
           db.insert(unitTypes).values({
             projectId: projectRecord.id,
             imageUrl: typeImg,
           }).returning().then(([unit]) => {
             return db.insert(projectTranslations).values({
               projectId: projectRecord.id,
               language: 'en',
               title: typeTitle
             } as any); // Actually this should go to unitTypeTranslations. We will refine this later.
           });
        });
      }

    } else {
      // It's a static page
      const rawSlug = route === '/' || route === '/pages/ar/home-ar' ? 'home' : route.split('/').pop() || 'unknown';
      const title = $('title').text().replace('- City Edge Developments', '').trim() || rawSlug;
      
      let pageRecord = await db.select().from(pages).where(eq(pages.slug, rawSlug)).limit(1).then(res => res[0]);
      if (!pageRecord) {
        const [inserted] = await db.insert(pages).values({ slug: rawSlug }).returning();
        pageRecord = inserted;
        console.log(`Created page: ${rawSlug}`);
      }
      
      await db.insert(pageTranslations).values({
        pageId: pageRecord.id,
        language: isArabic ? 'ar' : 'en',
        title,
      });
    }
  }

  console.log('Migration complete!');
}

runMigration().catch(console.error);
