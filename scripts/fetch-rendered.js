const http = require('http');
const fs = require('fs');

http.get('http://localhost:5173/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('rendered.html', data);
    console.log('Saved to rendered.html');
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
