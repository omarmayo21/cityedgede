const fs = require('fs');
const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
console.log('Index of Media Center:', html.indexOf('Media Center'));
console.log('Index of footer start:', html.indexOf('data-elementor-type="footer"'));
