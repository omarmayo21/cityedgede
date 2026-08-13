const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(html);

const footer = $('div[data-elementor-type="footer"]');
console.log('Footer parent:', footer.parent().prop('tagName'));

const nextSiblings = footer.nextAll().map((i, el) => {
    return el.tagName + (el.attribs ? ' class="' + el.attribs.class + '"' : '');
}).get();

console.log('Next siblings:', nextSiblings);

const header = $('div[data-elementor-type="header"]');
const prevSiblings = header.prevAll().map((i, el) => {
    return el.tagName + (el.attribs ? ' class="' + el.attribs.class + '"' : '');
}).get();

console.log('Header prev siblings:', prevSiblings);

// Check if there's any duplication in the original HTML
const main = $('main.site-main');
console.log('Number of mains:', main.length);
