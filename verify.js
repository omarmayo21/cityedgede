const puppeteer = require('puppeteer-core');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:5173';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // ====== TEST 1: MAIN PROJECT FILTER ======
    console.log('\n=== TEST 1: Main Project Filter ===');
    await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
    await sleep(1500);

    const filterForm = await page.$('#adv-project-filters-form');
    console.log('Filter form present:', !!filterForm);

    // Select Location = New Cairo City (value 7)
    await page.select('#filter-location', '7');
    await sleep(800);

    const gridActive = await page.$('#adv-filter-results-grid.active');
    console.log('Grid shown after location filter:', !!gridActive);

    const gridItems = await page.$$('#adv-filter-results-grid .filter-grid-item');
    console.log('Filtered project count (New Cairo City):', gridItems.length);

    // Check carousel is hidden
    const carouselHidden = await page.$('#adv-project-carousel-wrapper.filter-hidden');
    console.log('Carousel hidden when filter active:', !!carouselHidden);

    // Select Project Type = Residential (19)
    await page.select('#filter-parent-type', '19');
    await sleep(800);

    const childEnabled = await page.$eval('#filter-child-type', el => !el.disabled);
    console.log('Types select enabled after Project Type selection:', childEnabled);

    const childOptions = await page.$$eval('#filter-child-type option', opts => opts.map(o => o.textContent));
    console.log('Child type options:', childOptions.slice(0, 5));

    const gridItems2 = await page.$$('#adv-filter-results-grid .filter-grid-item');
    console.log('Filtered count (New Cairo + Residential):', gridItems2.length);

    // Select a child type
    const childTypes = await page.$$eval('#filter-child-type option', opts => opts.filter(o => o.value).map(o => o.value));
    if (childTypes.length > 0) {
      await page.select('#filter-child-type', childTypes[0]);
      await sleep(600);
      const gridItems3 = await page.$$('#adv-filter-results-grid .filter-grid-item');
      console.log(`Filtered count with child type "${childTypes[0]}":`, gridItems3.length);
    }

    // Clear filters
    await page.select('#filter-location', '');
    await page.select('#filter-parent-type', '');
    await sleep(600);
    const gridGone = await page.$('#adv-filter-results-grid.active');
    const carouselBack = await page.$('#adv-project-carousel-wrapper.filter-hidden');
    console.log('Grid hidden after clearing:', !gridGone);
    console.log('Carousel restored after clearing:', !carouselBack);

    // ====== TEST 2: DESTINATION NAVIGATION ======
    console.log('\n=== TEST 2: Destination Navigation ===');

    const testLocations = [
      { slug: 'new-cairo-city', label: 'New Cairo City' },
      { slug: 'sheikh-zayed-city', label: 'Sheikh Zayed City' },
      { slug: 'new-alamein-city', label: 'New Alamein City' },
      { slug: 'new-capital-city', label: 'New Capital City' },
    ];

    for (const loc of testLocations) {
      await page.goto(BASE + '/location/' + loc.slug, { waitUntil: 'networkidle2' });
      await sleep(800);
      const url = page.url();
      const h1 = await page.$eval('h1', el => el.textContent?.trim()).catch(() => 'NOT FOUND');
      const redirected = url === BASE + '/';
      console.log(`${loc.label}: URL=${url} | H1="${h1}" | Redirected=${redirected}`);
    }

    // ====== TEST 3: INDIVIDUAL PROJECT FILTER ======
    console.log('\n=== TEST 3: Individual Project Unit Filter ===');
    await page.goto(BASE + '/project/almaqsad-villas', { waitUntil: 'networkidle2' });
    await sleep(1200);

    const filterLinks = await page.$$('.unit-type-links .filter-link');
    console.log('Unit filter links found:', filterLinks.length);

    if (filterLinks.length > 1) {
      const urlBefore = page.url();
      // Click the second filter link (first is usually "All")
      await filterLinks[1].click();
      await sleep(600);
      const urlAfter = page.url();
      console.log('URL before filter click:', urlBefore);
      console.log('URL after filter click:', urlAfter);
      console.log('Did NOT redirect to /:', urlAfter !== BASE + '/');
    }

    // ====== TEST 4: Swiper still works ======
    console.log('\n=== TEST 4: Swiper Check ===');
    await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
    await sleep(1500);

    const swiperInit = await page.$('.swiper.swiper-initialized');
    console.log('Swiper initialized:', !!swiperInit);

    const swiperSlides = await page.$$('#adv-project-carousel-wrapper .swiper-slide:not(.swiper-slide-duplicate)');
    console.log('Swiper slides count:', swiperSlides.length);

    console.log('\n✅ Verification complete!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

run();
