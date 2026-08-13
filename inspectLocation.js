const fs = require('fs');
const path = require('path');

const p = path.join('d:/front end dev/city-edgede/cityedge-frontend/pages/location/new-cairo-city-en/index.html');
const html = fs.readFileSync(p, 'utf8');

// Find the archive section (type=archive)
const archiveStart = html.indexOf('data-elementor-type="archive"');
if (archiveStart < 0) {
  console.log('No archive found');
  process.exit(1);
}

// Go back to find the opening div tag
const divBefore = html.lastIndexOf('<div', archiveStart);
console.log('Archive div starts at:', divBefore);
console.log('First 2KB of archive section:');
console.log(html.substring(divBefore, divBefore + 2000));
