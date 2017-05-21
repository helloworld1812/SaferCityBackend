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

test('/reports POST returns error for report with no title', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send({
      location: 'Santana Row',
      time: new Date(2017, 5, 11, 20, 0, 0, 0),
      details: 'Bar surfing',
    })
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const titleErrors = getErrorsForField(errors, 'title');
      expect(titleErrors.length).toBeGreaterThan(0); // At least 1 error message

      const titleErrorsAboutRequired = getErrorsContainingText(titleErrors, 'required');
      expect(titleErrorsAboutRequired.length).toBe(1);
    })
));

test('/reports POST returns error for report with no location', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send({
      title: 'Ivan departure party',
      time: new Date(2017, 5, 11, 20, 0, 0, 0),
      details: 'Bar surfing',
    })
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const locationErrors = getErrorsForField(errors, 'location');
      expect(locationErrors.length).toBeGreaterThan(0); // At least 1 error message

      const locationErrorsAboutRequired = getErrorsContainingText(locationErrors, 'required');
      expect(locationErrorsAboutRequired.length).toBe(1);
    })
));

test('/reports POST returns error for report with no time', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send({
      title: 'Ivan departure party',
      location: 'Santana Row',
      details: 'Bar surfing',
    })
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const timeErrors = getErrorsForField(errors, 'time');
      expect(timeErrors.length).toBeGreaterThan(0); // At least 1 error message

      const timeErrorsAboutRequired = getErrorsContainingText(timeErrors, 'required');
      expect(timeErrorsAboutRequired.length).toBe(1);
    })
));

test('/reports POST returns error for report with not valid time', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send({
      title: 'Ivan departure party',
      location: 'Santana Row',
      time: 'Saturday!',
      details: 'Bar surfing',
    })
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const timeErrors = getErrorsForField(errors, 'time');
      expect(timeErrors.length).toBeGreaterThan(0); // At least 1 error message

      const timeErrorsAboutValid = getErrorsContainingText(timeErrors, 'valid');
      expect(timeErrorsAboutValid.length).toBe(1);
    })
));
