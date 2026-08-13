/**
 * Navigation white-page regression test.
 * Tests that every page renders with opacity > 0 (no white page).
 */
const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const routes = [
    '/',
    '/location/new-cairo-city',
    '/location/sheikh-zayed-city',
    '/project/lush-valley',
    '/project/etapa',
    '/project/mazarine-apartments',
  ];

  let allPassed = true;

  // Navigate to base first
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  for (const route of routes) {
    // Navigate via SPA (no full reload) using window.history
    await page.evaluate((r) => {
      window.history.pushState({}, '', r);
      window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    }, route);
    
    await new Promise(r => setTimeout(r, 800));

    // Check body opacity (preloader issue would make it 0)
    const bodyOpacity = await page.evaluate(() => {
      const body = document.body;
      const style = window.getComputedStyle(body);
      // Check if body has 'complete' class (preloader)
      const hasComplete = body.classList.contains('complete');
      // Check actual computed opacity of first direct child
      const firstChild = body.children[0];
      const childOpacity = firstChild ? window.getComputedStyle(firstChild).opacity : '1';
      return { hasComplete, childOpacity, bodyClass: body.className };
    });

    const url = await page.url();
    const pass = parseFloat(bodyOpacity.childOpacity) > 0 && bodyOpacity.hasComplete;
    
    if (!pass) {
      allPassed = false;
      console.log(`❌ FAIL ${route}:`, bodyOpacity);
    } else {
      console.log(`✅ OK ${route}: opacity=${bodyOpacity.childOpacity}, complete=${bodyOpacity.hasComplete}`);
    }
  }

  // Test filter doesn't cause white page
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  
  const locationSelect = await page.$('#filter-location');
  if (locationSelect) {
    await locationSelect.select('7');
    await new Promise(r => setTimeout(r, 600));
    
    const afterFilter = await page.evaluate(() => {
      const body = document.body;
      const firstChild = body.children[0];
      const childOpacity = firstChild ? window.getComputedStyle(firstChild).opacity : '1';
      return { hasComplete: body.classList.contains('complete'), childOpacity };
    });
    
    if (parseFloat(afterFilter.childOpacity) > 0 && afterFilter.hasComplete) {
      console.log('✅ OK filter action: opacity OK, complete OK');
    } else {
      allPassed = false;
      console.log('❌ FAIL filter action caused white page:', afterFilter);
    }
  } else {
    console.log('⚠️ Filter select not found (may not render on home page yet)');
  }

  await browser.close();
  
  if (allPassed) {
    console.log('\n✅ White page regression test PASSED!');
  } else {
    console.log('\n❌ White page regression test FAILED!');
    process.exit(1);
  }
}

run().catch(e => {
  console.error('Test error:', e);
  process.exit(1);
});
