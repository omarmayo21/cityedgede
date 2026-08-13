const fs = require('fs');
const html = fs.readFileSync('../../cityedge-frontend/index.html', 'utf8');
const indices = [];
let idx = html.indexOf('Media Center');
while (idx !== -1) {
    indices.push(idx);
    idx = html.indexOf('Media Center', idx + 1);
}
console.log('Indices of Media Center:', indices);
