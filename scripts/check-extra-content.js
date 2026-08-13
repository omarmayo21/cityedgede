const fs = require('fs');

const home = fs.readFileSync('../client/src/pages/Home.tsx', 'utf8');
const footer = fs.readFileSync('../client/src/components/Footer.tsx', 'utf8');

console.log('Home has popup:', home.includes('data-elementor-type="popup"'));
console.log('Home has template:', home.includes('<template'));
console.log('Home has main:', home.includes('<main'));
console.log('Footer has popup:', footer.includes('data-elementor-type="popup"'));
console.log('Footer has template:', footer.includes('<template'));

// Find what's after the footer in Footer.tsx
const footerMatch = footer.match(/<\/footer>([\s\S]*)/);
if (footerMatch) {
    console.log('After footer tag in Footer.tsx:', footerMatch[1]);
}

// Find what's after the main tag in Home.tsx
const mainMatch = home.match(/<\/main>([\s\S]*)/);
if (mainMatch) {
    console.log('After main tag in Home.tsx:', mainMatch[1]);
}
