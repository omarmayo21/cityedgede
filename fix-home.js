const fs = require('fs');

const formMarkup = `\n\t\t\t\t<div className="e-con-boxed e-con e-parent" style={{ padding: '50px 20px', marginTop: '30px', marginBottom: '30px' }}>
\t\t\t\t\t<div className="e-con-inner" style={{ justifyContent: 'center' }}>
\t\t\t\t\t\t<ContactForm />
\t\t\t\t\t</div>
\t\t\t\t</div>\n`;

let content = fs.readFileSync('d:/front end dev/city-edgede/cityedge-app/client/src/pages/Home.tsx', 'utf8');
content = content.replace(formMarkup, '');
fs.writeFileSync('d:/front end dev/city-edgede/cityedge-app/client/src/pages/Home.tsx', content);
console.log('Fixed Home');
