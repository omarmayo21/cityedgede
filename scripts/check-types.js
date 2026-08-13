const fs = require('fs');

const home = fs.readFileSync('../client/src/pages/Home.tsx', 'utf8');

const matches = [...home.matchAll(/data-elementor-type="([^"]+)"/g)];
const counts = {};
matches.forEach(m => counts[m[1]] = (counts[m[1]] || 0) + 1);
console.log('data-elementor-type counts in Home.tsx:', counts);

// Check if there are any <footer tags in Home
console.log('Has <footer in Home:', home.includes('<footer'));
