const fs = require('fs');
let c = fs.readFileSync('../client/src/pages/AboutUs.tsx', 'utf8');
c = c.replace(/ srcset="/gi, ' srcSet="');
c = c.replace(/ playsinline /gi, ' playsInline ');
c = c.replace(/ autoplay /gi, ' autoPlay ');
fs.writeFileSync('../client/src/pages/AboutUs.tsx', c);
console.log('Fixed srcSet');
