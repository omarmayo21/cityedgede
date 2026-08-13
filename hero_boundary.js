const fs = require('fs');
const html = fs.readFileSync('D:/front end dev/city-edgede/cityedge-frontend/index.html', 'utf8');

// Find the first few top level elementor elements inside elementor-6996
const mainMatch = html.match(/<div[^>]*class="[^"]*elementor-6996[^"]*"[^>]*>([\s\S]*?)<\/main>/);
if (mainMatch) {
    const content = mainMatch[1];
    const topLevels = content.match(/<div[^>]*class="[^"]*e-con-full[^"]*"[^>]*>/gi);
    console.log(topLevels ? topLevels.slice(0, 5) : 'none found');
} else {
    console.log('main not found');
}
