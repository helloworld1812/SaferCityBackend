/* global test, expect, afterAll */
// Load and run the app
const runningApp = require('./app');
const request = require('request');

const APP_URL = 'http://127.0.0.1:8080';

afterAll(() => {
  runningApp.close();
});

test('/events get returns 500', (done) => {
  request.get(`${APP_URL}/events`).on('response', (res) => {
    expect(res.statusCode).toBe(500);
    done();
  });
});

test('/events/1 get returns 500', (done) => {
  request.get(`${APP_URL}/events/1`).on('response', (res) => {
    expect(res.statusCode).toBe(500);
    done();
  });
});

test('/events post returns 500', (done) => {
  request.post(`${APP_URL}/events`, { form: { title: 'New event' } }).on('response', (res) => {
    expect(res.statusCode).toBe(500);
    done();
  });
});

test('/events/1 put returns 500', (done) => {
  request.put(`${APP_URL}/events/1`).on('response', (res) => {
    expect(res.statusCode).toBe(500);
    done();
  });
});

test('/events/1 delete returns 500', (done) => {
  request.delete(`${APP_URL}/events/1`).on('response', (res) => {
    expect(res.statusCode).toBe(500);
    done();
  });
});
