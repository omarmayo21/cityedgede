import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[BROWSER ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', error => console.error(`[BROWSER ERROR] ${error.message}`));

  const checkRoute = async (url) => {
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));
    const result = await page.evaluate(() => {
      const root = document.getElementById('root');
      const style = window.getComputedStyle(root);
      return {
        opacity: style.opacity,
        bodyClass: document.body.className,
        rootChildren: root ? root.children.length : 0,
      };
    });
    console.log(`${url} => opacity=${result.opacity}, body.class="${result.bodyClass}", rootChildren=${result.rootChildren}`);
    return result;
  };

  const homeResult = await checkRoute('http://localhost:5174/');
  const aboutResult = await checkRoute('http://localhost:5174/about-us');

  if (homeResult.opacity === '1' && aboutResult.opacity === '1') {
    console.log('\n✅ BOTH ROUTES VISIBLE — white page bug is FIXED');
  } else {
    console.log('\n❌ STILL INVISIBLE — more investigation needed');
  }

  // Screenshot of homepage
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'verification-screenshot.png', fullPage: false });
  console.log('Screenshot saved to verification-screenshot.png');

  await browser.close();
})();
