const fs = require('fs');

// Check that all 45 project pages have correct structure
const pages = fs.readdirSync('client/src/pages').filter(f => f.startsWith('Project') && f.endsWith('.tsx'));

let issues = [];

pages.forEach(pageFile => {
  const content = fs.readFileSync(`client/src/pages/${pageFile}`, 'utf8');
  
  const hasContactForm = content.includes('ContactForm');
  const hasReturn = content.includes('return (');
  const hasExport = content.includes('export default');
  const hasFilterLink = content.includes('filter-link');
  const hasUnitTypeSection = content.includes('unit-type-section');
  
  if (!hasContactForm) issues.push(`${pageFile}: missing ContactForm`);
  if (!hasReturn) issues.push(`${pageFile}: missing return`);
  if (!hasExport) issues.push(`${pageFile}: missing export default`);
});

console.log(`Total project pages: ${pages.length}`);
if (issues.length === 0) {
  console.log('All pages look structurally valid!');
} else {
  issues.forEach(i => console.log('ISSUE:', i));
}

// Check routes match actual project pages
const app = fs.readFileSync('client/src/App.tsx', 'utf8');
const originals = fs.readdirSync('d:/front end dev/city-edgede/cityedge-frontend/pages/project');
console.log(`\nOriginal scraped projects: ${originals.length}`);
console.log(`React project pages: ${pages.length}`);

// Check for routes missing from App.tsx
const missingRoutes = originals.filter(p => !app.includes(`/project/${p}`));
if (missingRoutes.length > 0) {
  console.log('Missing routes in App.tsx:', missingRoutes);
} else {
  console.log('All original project routes exist in App.tsx!');
}
