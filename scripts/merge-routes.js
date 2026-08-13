const fs = require('fs');

const dynamicRoutesPath = '../client/src/pages/DynamicRoutes.tsx';
const appPath = '../client/src/App.tsx';

let dynamicContent = fs.readFileSync(dynamicRoutesPath, 'utf8');

// Extract all lines starting with "const Project" or "const Location" or "const ArProject" or "const ArLocation"
const importLines = dynamicContent.match(/^const (Project|Location|ArProject|ArLocation).*$/gm);

// Extract all <Route ... />
const routeLines = dynamicContent.match(/<Route path="[^"]+" element=\{<[^>]+ \/>\} \/>/g);

let appContent = fs.readFileSync(appPath, 'utf8');

// Insert imports right before "function App()"
const importsStr = `import React, { lazy, Suspense } from 'react';\n` + importLines.join('\n') + '\n\n';
appContent = appContent.replace('function App() {', importsStr + 'function App() {');

// Insert routes right before "        <Route path="/ar" element={<Home />} />"
const routesStr = routeLines.map(r => `        ${r}`).join('\n') + '\n';
appContent = appContent.replace('        <Route path="/ar" element={<Home />} />', routesStr + '        <Route path="/ar" element={<Home />} />');

// Remove <DynamicRoutes /> from App.tsx
appContent = appContent.replace('      <DynamicRoutes />\n', '');
// Remove import DynamicRoutes
appContent = appContent.replace("import DynamicRoutes from './pages/DynamicRoutes';\n", '');

// Wrap <Routes> in <Suspense>
appContent = appContent.replace('<Routes>', '<Suspense fallback={<div>Loading...</div>}>\n      <Routes>');
appContent = appContent.replace('</Routes>', '</Routes>\n      </Suspense>');

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('App.tsx updated successfully.');
