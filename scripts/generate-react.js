const fs = require('fs');

function wrapComponent(name, htmlPath, tag, className) {
  const content = fs.readFileSync(htmlPath, 'utf8');
  let openTag = `<${tag}>`;
  if (className) {
    openTag = `<${tag} className="${className}">`;
  }
  
  const jsx = `// @ts-nocheck
import React from 'react';

export default function ${name}() {
  return (
    ${openTag}
      ${content}
    </${tag}>
  );
}
`;

  let outPath = `../client/src/components/${name}.tsx`;
  if (name === 'RawHome') {
    outPath = `../client/src/pages/${name}.tsx`;
  }
  fs.writeFileSync(outPath, jsx, 'utf8');
}

wrapComponent('Header', 'parts/header.jsx.txt', 'header', 'elementor elementor-38 elementor-location-header');
wrapComponent('Footer', 'parts/footer.jsx.txt', 'footer', 'elementor elementor-304 elementor-location-footer');
wrapComponent('RawHome', 'parts/main.jsx.txt', 'main', 'site-main post-6996 page type-page status-publish hentry');
