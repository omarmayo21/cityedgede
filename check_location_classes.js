const fs = require('fs');
const html = fs.readFileSync('client/src/pages/LocationNewCairoCity.tsx', 'utf8');

// Find e-loop-item class strings
const loopItemRegex = /e-loop-item-\d+[^"]+/g;
const matches = html.match(loopItemRegex);
if (matches) {
  matches.slice(0, 3).forEach(m => console.log(m.substring(0, 300)));
} else {
  console.log('no e-loop-items found');
}

// Also look for uc-items-wrapper
const ucItemsWrapperIdx = html.indexOf('uc-items-wrapper');
console.log('uc-items-wrapper found at index:', ucItemsWrapperIdx);

// Look for project-type- classes
const projectTypeRegex = /project-type-[a-z0-9-]+/g;
const ptMatches = [...new Set(html.match(projectTypeRegex) || [])];
console.log('Project type classes found:', ptMatches.slice(0, 20));
