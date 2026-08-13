const fs = require('fs');
const html = fs.readFileSync('D:/front end dev/city-edgede/cityedge-frontend/index.html', 'utf8');
const match = html.match(/<form[^>]*class="[^"]*elementor-form[^"]*"[^>]*>[\s\S]*?<\/form>/i);
if (match) {
    fs.mkdirSync('.temp', { recursive: true });
    fs.writeFileSync('.temp/original_form.html', match[0]);
    console.log('Form extracted to .temp/original_form.html');
} else {
    console.log('elementor-form not found in index.html');
}
