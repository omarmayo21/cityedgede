const fs = require('fs');
const html = fs.readFileSync('../client/src/components/Footer.tsx', 'utf8');

// The footer component should just return the actual footer content.
// We will strip everything after the main footer div.

let newHtml = html.substring(0, html.indexOf('</div>', html.lastIndexOf('e-con-inner')) + 6);

// But wait, there are a few closing divs to close the data-elementor-type="footer"
// Let's just use cheerio to extract JUST the data-elementor-type="footer"

const cheerio = require('cheerio');
const $ = cheerio.load(html, { xmlMode: true });

const footerDiv = $('div[data-elementor-type="footer"]');
const newComponent = `import React from 'react';

export default function Footer() {
  return (
    <footer className="elementor elementor-304 elementor-location-footer">
      ${$.html(footerDiv)}
    </footer>
  );
}
`;

fs.writeFileSync('../client/src/components/Footer.tsx', newComponent);
console.log('Fixed Footer.tsx');
