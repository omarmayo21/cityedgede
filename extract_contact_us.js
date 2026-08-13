const fs = require('fs');
const html = fs.readFileSync('D:/front end dev/city-edgede/cityedge-frontend/index.html', 'utf8');
const rx = /<h2 class="elementor-heading-title elementor-size-default">Contact us<\/h2>/gi;
let match = rx.exec(html);
if (match) {
    fs.writeFileSync('D:/front end dev/city-edgede/cityedge-app/contact_us_extracted.html', html.substring(match.index-1000, match.index+10000));
    console.log('Extracted to contact_us_extracted.html');
} else {
    console.log('Not found');
}
