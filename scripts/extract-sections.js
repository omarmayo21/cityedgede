const fs = require('fs');
const content = fs.readFileSync('../client/src/pages/RawHome.tsx', 'utf8');

const mapStartStr = '<div className="has_eae_slider elementor-element elementor-element-f36d906';
const projectsStartStr = '<div className="has_eae_slider elementor-element elementor-element-417bdf8';

const mapIdx = content.indexOf(mapStartStr);
const projIdx = content.indexOf(projectsStartStr);

const destinationsHtml = content.substring(mapIdx, projIdx);
const projectsHtml = content.substring(projIdx, content.lastIndexOf('</main>'));

fs.writeFileSync('../client/src/components/home/DestinationsSection.tsx', `// @ts-nocheck\nimport React from 'react';\n\nexport default function DestinationsSection() {\n  return (\n    <>\n      ${destinationsHtml}\n    </>\n  );\n}\n`, 'utf8');

fs.writeFileSync('../client/src/components/home/ProjectsSection.tsx', `// @ts-nocheck\nimport React from 'react';\n\nexport default function ProjectsSection() {\n  return (\n    <>\n      ${projectsHtml}\n    </>\n  );\n}\n`, 'utf8');
