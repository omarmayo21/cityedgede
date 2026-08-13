const fs = require('fs');
const html = fs.readFileSync('D:/front end dev/city-edgede/cityedge-frontend/index.html', 'utf8');

const regex = /<form[\s\S]*?<\/form>/gi;
const matches = html.match(regex);
if (matches) {
    fs.writeFileSync('forms.html', matches.join('\n\n=====\n\n'));
    console.log('Found ' + matches.length + ' forms');
} else {
    console.log('No forms found');
}
