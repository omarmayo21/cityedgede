const fs = require('fs');
const path = require('path');

const locations = [
  'new-cairo-city-en',
  'sheikh-zayed-city-en',
  'new-alamein-city-en',
  'new-capital-city-en',
  'new-mansoura-city-en',
  'maspero-triangle-en'
];

locations.forEach(loc => {
  const p = path.join('d:/front end dev/city-edgede/cityedge-frontend/pages/location', loc, 'index.html');
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, 'utf8');
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const projectLinks = [];
    const re = /href="\/project\/([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      if (!projectLinks.includes(m[1])) projectLinks.push(m[1]);
    }
    console.log('\n===', loc, '===');
    console.log('Title:', titleMatch ? titleMatch[1] : 'none');
    console.log('H1:', h1Matches ? h1Matches[1].replace(/<[^>]+>/g, '').trim().substring(0,80) : 'none');
    console.log('Projects:', projectLinks.join(', '));
    console.log('HTML size:', Math.round(html.length / 1024), 'KB');
  }
});
