const http = require('http');

const data = JSON.stringify({
  name: 'Test Lead',
  email: 'test@example.com',
  phone: '1234567890',
  message: 'This is a test message for SMTP testing',
  inquiryType: 'sales',
  country: 'Egypt',
  destination: '',
  project: ''
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
