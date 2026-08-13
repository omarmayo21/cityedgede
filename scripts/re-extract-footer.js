const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, '../../cityedge-frontend/index.html');
const footerOutPath = path.join(__dirname, '../client/src/components/Footer.tsx');

const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html, { xmlMode: true });

// Extract the footer
const footerDiv = $('div[data-elementor-type="footer"]').first();

// Remove elements containing specific text
footerDiv.find('li').each((i, el) => {
    const text = $(el).text().toLowerCase();
    if (text.includes('hospitality') || text.includes('careers') || text.includes('visit us') || text.includes('visit-us')) {
        $(el).remove();
    }
});

let footerStr = $.html(footerDiv);

// Clean up attributes
footerStr = footerStr.replace(/\bclass="/g, 'className="');
footerStr = footerStr.replace(/\bfor="/g, 'htmlFor="');
footerStr = footerStr.replace(/ tabindex="/gi, ' tabIndex="');
footerStr = footerStr.replace(/ viewBox="/gi, ' viewBox="');
footerStr = footerStr.replace(/ fill-rule="/gi, ' fillRule="');
footerStr = footerStr.replace(/ clip-rule="/gi, ' clipRule="');
footerStr = footerStr.replace(/ stroke-width="/gi, ' strokeWidth="');
footerStr = footerStr.replace(/ stroke-linecap="/gi, ' strokeLinecap="');
footerStr = footerStr.replace(/ stroke-linejoin="/gi, ' strokeLinejoin="');

// Fix style attributes
footerStr = footerStr.replace(/style="([^"]*)"/g, (match, p1) => {
    const parts = p1.split(';').filter(Boolean);
    const obj = {};
    parts.forEach(part => {
        const [k, v] = part.split(':');
        if (k && v) {
            let key = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            if (key === '--eae-slider-slide-count') key = "'--eae-slider-slide-count'";
            if (key.startsWith('--')) key = `'${key}'`;
            obj[key] = v.trim();
        }
    });
    const objStr = Object.keys(obj).map(k => `${k}: '${obj[k].replace(/'/g, "\\'")}'`).join(', ');
    return `style={{${objStr}}}`;
});

const componentStr = `export default function Footer() {
  return (
    <footer className="elementor elementor-304 elementor-location-footer">
      ${footerStr}
    </footer>
  );
}
`;

fs.writeFileSync(footerOutPath, componentStr);
console.log('Fixed Footer.tsx');
