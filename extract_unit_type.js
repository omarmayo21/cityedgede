const fs = require('fs');
const c = fs.readFileSync('D:/front end dev/city-edgede/cityedge-frontend/pages/project/verandas/index.html', 'utf8');
const rx = /class=\"[^\"]*unit-type-section[^\"]*\"[^>]*data-unit-type=\"([^\"]+)\"/gi;
let m;
while((m=rx.exec(c))!==null){
  console.log(m[1]);
}
