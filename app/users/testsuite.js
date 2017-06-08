/**
 * Integration test suite for user entity.
 * Intended to be required from app.test.js.
 */

/* global describe, test, expect */
const request = require('superagent');

const APP_URL = global.appUrl;

// # Test data

const users = [{
  name: 'Jack',
}, {
  name: 'Oleg',
}, {
  name: 'Alexa',
}];

/** Utility function to return id of index-th item */
const id = index => users[index].id;


// # Tests
// Please note: test order matters

// ## Put test data in database
test('/reports POST returns id of newly created item', () => (
  // code below returns promise
  Promise.all(Object.keys(users).map(index => (
    request.post(`${APP_URL}/users`)
      .set('Content-Type', 'application/json')
      .send(users[index])
      .then((resp) => {
        expect(resp.body).toBeDefined();
        users[index].id = resp.body;
      })
  )))
));

// ## Make sure error is returned for invalid reports
describe('"Users" validators', () => {
  require('./validators.testsuite'); // eslint-disable-line global-require
});

// ## Check if we can grab object by id
test('/users/:id GET returns user for existing id', () => (
  // code below returns promise
  request.get(`${APP_URL}/users/${id(0)}`)
    .then((res) => {
      const receivedUser = res.body;
      expect(receivedUser.name).toEqual(users[0].name);
    })
));

// ## But non-existing id returns 404
test('/users/:id GET returns 404 error for non-existing id', () => (
  // code below returns promise
  request.get(`${APP_URL}/users/-1`)
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

// ## Check if we can update object by id
test('/users/:id PUT updates existing id', () => {
  users[0].name = 'Clara';
  return request.put(`${APP_URL}/users/${id(0)}`)
    .set('Content-Type', 'application/json')
    .send(users[0])
    .then(() => (
      // When we've updated we would like to check that user is indeed updated
      // So we issue a request to fetch just modified data...
      request.get(`${APP_URL}/users/${id(0)}`)
    ))
    .then((res) => {
      // ... and then check that it's indeed equal to an updated user
      const receivedUser = res.body;
      expect(receivedUser.name).toEqual(users[0].name);
    });
});

// ## But update by non-existing id returns 404
test('/users/:id PUT returns 404 error for non-existing id', () => (
  // code below returns promise
  request.put(`${APP_URL}/users/-1`)
    .set('Content-Type', 'application/json')
    .send(users[0])
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

// ## Check if we can remove object
test('/users/:id DELETE removes the entity with existing id', () => (
  // code below returns promise
  // First fetch first user
  request.get(`${APP_URL}/users/${id(1)}`)
    .then((res) => {
      const receivedUser = res.body;
      // Verify this user exists
      expect(receivedUser.name).toBeDefined();
      // Remove this user
      return request.delete(`${APP_URL}/users/${id(1)}`);
    })
    .then(() => (
      // When we've removed the user we would like to check that it's indeed removed
      // So we issue a request to fetch this user one more time
      request.get(`${APP_URL}/users/${id(1)}`)
    ))
    .then(res => (Promise.reject(res))) // Request shouldn't be successful - reject it
    .catch((res) => {
      // Verify that request to fetch removed user returns 404;
      expect(res.status).toBe(404);
    })
));

// ## But if we remove by non-existing id we get 404
test('/users/:id DELETE return 404 error for non-existing id', () => (
  // code below returns promise
  request.delete(`${APP_URL}/users/-1`)
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));
