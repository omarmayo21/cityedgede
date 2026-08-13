const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(html);

console.log($('.elementor-section').length + ' sections found');

$('.elementor-section-wrap > .elementor-section').each((i, section) => {
  console.log(`\n--- SECTION ${i} ---`);
  // Print image classes, text
  $(section).find('h1, h2, h3, p, a.elementor-button, img').each((j, el) => {
    if (el.tagName === 'img') {
      console.log(`IMG: ${$(el).attr('src')}`);
    } else {
      console.log(`${el.tagName.toUpperCase()}: ${$(el).text().trim()}`);
    }
  });
});
