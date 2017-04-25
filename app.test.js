const http = require('http');
require('./app.js');

const APP_URL = 'http://127.0.0.1:8080';

http.get(APP_URL + '/api/events', res => {
  res.on('data', (event) => {
    if (JSON.parse(event).title === 'Free wine!') {
      console.log("PASS");
    } else {
      console.log("FAIL");
    }
  });
});

http.get(APP_URL, res => {
  if (res.statusCode == 404) {
    console.log("PASS");
  } else {
    console.log("FAIL");
  }
});