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

test('/comments POST returns error for comment with no text', () => (
  // code below returns promise
  request.post(`${APP_URL}/comments`)
    .set('Content-Type', 'application/json')
    .send({
      time: new Date(2017, 5, 11, 20, 0, 0, 0),
    })
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const fieldErrors = getErrorsForField(errors, 'text');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'required')).toHaveLength(1);
    })
));

test('/comments POST returns error for comment with too long (>255) text', () => (
  // code below returns promise
  request.post(`${APP_URL}/comments`)
    .set('Content-Type', 'application/json')
    .send({
      text: 'An infinite number of mathematicians walk into a bar. The first one '
        + 'orders a beer. The second one orders half a beer. The third one orders '
        + 'a fourth of a beer. The bartender stops them, pours two beers, and '
        + 'replies "You should know your limits." (taken from reddit)',
      time: new Date(2017, 5, 11, 20, 0, 0, 0),
    })
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const fieldErrors = getErrorsForField(errors, 'text');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'long')).toHaveLength(1);
      expect(getErrorsContainingText(fieldErrors, '255')).toHaveLength(1);
    })
));

// Same validator is used to validate PUT requests.
test('/comments PUT also has validation', () => (
  // code below returns promise
  // Create valid comment
  request.post(`${APP_URL}/comments`)
    .set('Content-Type', 'application/json')
    .send({
      text: 'Good comment',
      time: new Date(2017, 5, 11, 20, 0, 0, 0),
    })
    .then(resp => (
      // Set update request with obviously invalid value
      request.put(`${APP_URL}/comments/${resp.body}`) // eslint-disable-line
        .set('Content-Type', 'application/json')
        .send({})
    ))
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((resp) => {
      expect(resp.status).toBe(422);
    })
));
