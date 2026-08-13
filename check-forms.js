const fs = require('fs');
const path = require('path');
const pagesDir = 'd:/front end dev/city-edgede/cityedge-app/client/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));
let withForm = 0, withoutForm = [];
for (const f of files) {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  if (content.includes('ContactForm')) withForm++;
  else withoutForm.push(f);
}
console.log('Pages WITH ContactForm:', withForm);
console.log('Pages WITHOUT ContactForm count:', withoutForm.length);
// Check Home specifically
const home = fs.readFileSync(pagesDir+'/Home.tsx','utf8');
console.log('Home has <ContactForm:', home.includes('<ContactForm'));
console.log('Home imports ContactForm:', home.includes('import ContactForm'));
