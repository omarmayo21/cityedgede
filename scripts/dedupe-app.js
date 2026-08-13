const fs = require('fs');
let c = fs.readFileSync('../client/src/App.tsx', 'utf8');
let lines = c.split('\n');
let imports = new Set();
let routes = new Set();
let newLines = [];
for (let l of lines) {
  const t = l.trim();
  if (t.startsWith('const Project') || t.startsWith('const ArProject') || t.startsWith('import Project') || t.startsWith('import ArProject')) {
    if (!imports.has(t)) {
      imports.add(t);
      newLines.push(l);
    }
  } else if (t.includes('<Route path="/project/') || t.includes('<Route path="/ar/project/')) {
    if (!routes.has(t)) {
      routes.add(t);
      newLines.push(l);
    }
  } else {
    newLines.push(l);
  }
}
fs.writeFileSync('../client/src/App.tsx', newLines.join('\n'));
