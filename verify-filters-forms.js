import puppeteer from 'puppeteer';

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log(`[BROWSER ${msg.type()}] ${msg.text()}`));
  
  // 1. Check Home
  console.log('Navigating to Home...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));
  
  const homeFormDetails = await page.evaluate(() => {
    const form = document.querySelector('.contact-form-wrapper');
    if (!form) return null;
    
    // Check if it's placed after the Hero (which is e-parent)
    const prevSibling = form.previousElementSibling;
    return {
      found: true,
      prevSiblingClass: prevSibling ? prevSibling.className : null,
      top: form.getBoundingClientRect().top
    };
  });
  console.log('Home Form Details:', homeFormDetails);

  // Take screenshot of home form
  const homeFormHandle = await page.$('.contact-form-wrapper');
  if (homeFormHandle) {
    await homeFormHandle.screenshot({ path: 'home-form-screenshot.png' });
    console.log('Saved home-form-screenshot.png');
  }

  // 2. Check Project Page (Almaqsad Villas)
  console.log('Navigating to Almaqsad Villas...');
  await page.goto('http://localhost:5173/project/almaqsad-villas/', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  const projectFormDetails = await page.evaluate(() => {
    const form = document.querySelector('.contact-form-wrapper');
    if (!form) return null;
    
    // Check if it's placed after the Hero
    const prevSibling = form.previousElementSibling;
    return {
      found: true,
      prevSiblingClass: prevSibling ? prevSibling.className : null,
      top: form.getBoundingClientRect().top
    };
  });
  console.log('Almaqsad Villas Form Details:', projectFormDetails);

  // Take screenshot of project form
  const projectFormHandle = await page.$('.contact-form-wrapper');
  if (projectFormHandle) {
    await projectFormHandle.screenshot({ path: 'project-form-screenshot.png' });
    console.log('Saved project-form-screenshot.png');
  }

  // 3. Check Filters on Project Page
  console.log('Checking filters...');
  const filterResults = await page.evaluate(async () => {
    const sections = Array.from(document.querySelectorAll('.unit-type-section'));
    const initialVisibility = sections.map(s => s.style.display);
    
    // Click a filter
    const links = document.querySelectorAll('.unit-type-links .filter-link');
    if (links.length > 1) {
      links[1].click(); // Click the second filter
    }

    // Wait for display update
    await new Promise(r => setTimeout(r, 500));
    
    const afterClickVisibility = sections.map(s => s.style.display);
    
    return {
      numSections: sections.length,
      numLinks: links.length,
      initialVisibility,
      afterClickVisibility,
      urlAfterClick: window.location.href
    };
  });
  
  console.log('Filter Results:', filterResults);
  
  await page.screenshot({ path: 'project-filtered-screenshot.png', fullPage: true });

  await browser.close();
})();
