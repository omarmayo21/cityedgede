const fs = require('fs');
const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const count = (html.match(/data-elementor-type="footer"/g) || []).length;
console.log('Footer count in original HTML:', count);
