/**
 * Integration tests for validators
 * Intended to be required from testsuite.js.
 */

/* global test, expect */
const request = require('superagent');

const APP_URL = global.appUrl;

/** Utility function that returns errors for specified field. */
const getErrorsForField = (errors, field) => errors.filter(e => e.param === field);
/** Utility function that returns errors which messages contain specified text. */
const getErrorsContainingText = (errors, text) => errors.filter(e => e.msg.includes(text));

test('/users POST returns error for user with no name', () => (
  // code below returns promise
  request.post(`${APP_URL}/users`)
    .set('Content-Type', 'application/json')
    .send({})
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const fieldErrors = getErrorsForField(errors, 'name');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'required')).toHaveLength(1);
    })
));

// Same validator is used to validate PUT requests.
test('/users PUT also has validation', () => (
  // code below returns promise
  // Create valid user
  request.post(`${APP_URL}/users`)
    .set('Content-Type', 'application/json')
    .send({
      name: 'Rajesh',
    })
    .then(resp => (
      // Set update request with obviously invalid value
      request.put(`${APP_URL}/users/${resp.body}`) // eslint-disable-line
        .set('Content-Type', 'application/json')
        .send({})
    ))
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((resp) => {
      expect(resp.status).toBe(422);
    })
));
