import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.toString()}`);
  });

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  
  // Wait to see if sliders do anything
  await new Promise(r => setTimeout(r, 2000));
  
  // Check if Swiper instances exist
  const swiperCount = await page.evaluate(() => {
    const swipers = document.querySelectorAll('.swiper, .swiper-container');
    let initialized = 0;
    swipers.forEach(s => {
      if (s.swiper) initialized++;
    });
    return { total: swipers.length, initialized };
  });
  console.log('Swiper instances:', swiperCount);

  await browser.close();
})();
