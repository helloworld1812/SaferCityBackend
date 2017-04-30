/* global test, expect, beforeAll, afterAll, jest */
const request = require('superagent');

// Don't connect to real DB
jest.mock('./mongo');

// Load and run the app
const serverPromise = require('./app');

const APP_URL = 'http://127.0.0.1:8080';
let runningApp = null;

beforeAll(() => {
  return serverPromise.then((app) => { runningApp = app; });
});

afterAll(() => {
  runningApp.close();
});

// Please note: test order matters

const event1 = { title: 'Event 1' };
const event2 = { title: 'Event 2' };
const id1 = 1;
const id2 = 2;

test('/events POST returns id of newly created item', () => (
  // code below returns promise
  request.post(`${APP_URL}/events`)
    .set('Content-Type', 'application/json')
    .send(event1)
    .then((resp) => {
      expect(resp.body).toEqual(id1);
    })
));

test('/events POST returns id of newly created item (one more time)', () => (
  // code below returns promise
  request.post(`${APP_URL}/events`)
    .set('Content-Type', 'application/json')
    .send(event2)
    .then((resp) => {
      expect(resp.body).toEqual(id2);
    })
));

test('/events GET returns 2 items', () => (
  // code below returns promise
  request.get(`${APP_URL}/events`)
    .then((resp) => {
      const events = resp.body;
      expect(events.length).toEqual(2);
      expect(events[0]).toEqual(event1);
      expect(events[1]).toEqual(event2);
    })
));

test('/events/:id GET returns event for existing id', () => (
  // code below returns promise
  request.get(`${APP_URL}/events/${id1}`)
    .then((res) => {
      const event = res.body;
      expect(event).toEqual(event1);
    })
));

test('/events/:id GET returns 404 error for non-existing id', () => (
  // code below returns promise
  request.get(`${APP_URL}/events/-1`)
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

test('/events/:id PUT updates existing id', () => {
  event1.title = 'Updated event';
  return request.put(`${APP_URL}/events/${id1}`)
    .set('Content-Type', 'application/json')
    .send(event1)
    .then(() => (
      // When we've updated we would like to check that event is indeed updated
      // So we issue a request to fetch just modified data...
      request.get(`${APP_URL}/events/${id1}`)
    ))
    .then((res) => {
      // ... and then check that it's indeed equal to an updated event
      const event = res.body;
      expect(event).toEqual(event1);
    });
});

test('/events/:id PUT returns 404 error for non-existing id', () => (
  // code below returns promise
  request.put(`${APP_URL}/events/-1`)
    .set('Content-Type', 'application/json')
    .send(event1)
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

test('/events/1 delete returns 500', () => (
  request.delete(`${APP_URL}/events/${id1}`)
    .then(() => (
      // When we've removed the event we would like to check that it's indeed removed
      // So we issue a request to fetch list of events...
      request.get(`${APP_URL}/events`)
    ))
    .then((resp) => {
      const events = resp.body;
      expect(events.length).toEqual(1);
    })
));
