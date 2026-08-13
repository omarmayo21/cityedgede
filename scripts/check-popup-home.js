const fs = require('fs');
const html = fs.readFileSync('../client/src/pages/Home.tsx', 'utf8');
console.log('Popup in Home:', html.includes('data-elementor-type="popup"'));
