/* global test, expect, afterAll */
// Load and run the app
const app = require('./app');
const http = require('http');

const APP_URL = 'http://127.0.0.1:8080';

afterAll(() => {
  app.close();
});

test('/api/events returns an event', (done) => {
  http.get(`${APP_URL}/api/events`, (res) => {
    res.on('data', (event) => {
      expect(JSON.parse(event).title).toBe('Free wine!');
      done();
    });
  });
});

test('/ returns 404', (done) => {
  http.get(APP_URL, (res) => {
    expect(res.statusCode).toBe(404);
    done();
  });
});
