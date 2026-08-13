const fs = require('fs');
const html = fs.readFileSync('../client/src/components/Footer.tsx', 'utf8');
const matches = [...html.matchAll(/data-elementor-type="([^"]+)"/g)].map(m => m[1]);
console.log('Footer elementor types:', matches);
