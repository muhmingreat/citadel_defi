const https = require('https');

const url = 'https://bsc-testnet.public.blastapi.io';

console.log(`Checking ${url}...`);

https.get(url, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    // just consume data
  });

  res.on('end', () => {
    console.log('Request finished');
  });

}).on('error', (e) => {
  console.error(e);
});
