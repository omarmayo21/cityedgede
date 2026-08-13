const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const $ = cheerio.load(html);

// We want to extract the main content. The main content is inside <main id="content">
const mainContent = $('main#content').html();

// Basic HTML to JSX conversion
let jsx = mainContent
  .replace(/class=/g, 'className=')
  .replace(/for=/g, 'htmlFor=')
  .replace(/<!--[\s\S]*?-->/g, '') // remove comments
  .replace(/<img(.*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<img${p1} />`;
  })
  .replace(/<br>/g, '<br />')
  .replace(/<hr>/g, '<hr />')
  .replace(/<input(.*?)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<input${p1} />`;
  })
  .replace(/style="([^"]*)"/g, '') // strip inline styles for now or fix them later
  .replace(/srcset="([^"]*)"/g, ''); // strip srcset to simplify

// Convert to a React component file
const component = `
import React from 'react';

export default function RawHome() {
  return (
    <main id="content" className="site-main post-6996 page type-page status-publish hentry">
      ${jsx}
    </main>
  );
}
`;

fs.writeFileSync('../client/src/pages/RawHome.tsx', component);
console.log('Generated RawHome.tsx');
