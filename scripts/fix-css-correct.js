const fs = require('fs');
let css = fs.readFileSync('../client/src/styles/about-us.css', 'utf8');

// The error was on line 10 previously because of `.city-edge-breadcrumbs a{color:#00263D!important}}`
// Let's replace EXACTLY that instead of globally!

// Actually we need to fetch the original CSS again because I ruined it with global replace
// So let's run the extract-about.js again, and then just fix that specific line correctly.

const { execSync } = require('child_process');
execSync('node extract-about.js', { stdio: 'inherit' });

// Now fix the specific error
let newCss = fs.readFileSync('../client/src/styles/about-us.css', 'utf8');
newCss = newCss.replace('.city-edge-breadcrumbs a{color:#00263D!important}}', '.city-edge-breadcrumbs a{color:#00263D!important}');
fs.writeFileSync('../client/src/styles/about-us.css', newCss);
console.log('Fixed CSS specific error');
