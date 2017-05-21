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

      const fieldErrors = getErrorsForField(errors, 'title');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'required')).toHaveLength(1);
    })
));

test('/reports POST returns error for report with too long (>80) title', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send({
      title: 'Most of the asteroids are not spherical because their gravity is not strong enough '
        + 'to form a sphere from rock.',
      location: 'Santana Row',
      time: new Date(2017, 5, 11, 20, 0, 0, 0),
      details: 'Bar surfing',
    })
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const fieldErrors = getErrorsForField(errors, 'title');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'long')).toHaveLength(1);
      expect(getErrorsContainingText(fieldErrors, '80')).toHaveLength(1);
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

      const fieldErrors = getErrorsForField(errors, 'location');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'required')).toHaveLength(1);
    })
));

test('/reports POST returns error for report with too long (>80) location', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send({
      title: 'Why asteroids are not spherical',
      location: 'Asteroids are located in "asteroid belt" between Mars and Jupiter where strong'
      + 'jovial gravity prevent them from forming a full-fledged planet.',
      time: new Date(2017, 5, 11, 20, 0, 0, 0),
      details: 'Bar surfing',
    })
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const fieldErrors = getErrorsForField(errors, 'location');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'long')).toHaveLength(1);
      expect(getErrorsContainingText(fieldErrors, '80')).toHaveLength(1);
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

      const fieldErrors = getErrorsForField(errors, 'time');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'required')).toHaveLength(1);
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

      const fieldErrors = getErrorsForField(errors, 'time');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'valid')).toHaveLength(1);
    })
));

test('/reports POST returns error for report with too long (>255) description', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send({
      title: 'Why asteroids are not spherical',
      location: 'Asteroid belt',
      time: new Date(2017, 5, 11, 20, 0, 0, 0),
      details: 'There is asteroid that is spherical - Ceres. Its radius is 945 km and '
        + 'it has strong enough gravity to round the dwarf planet. How does gravity '
        + 'related to roundness? Big asteroids are forming by gathering smaller '
        + 'asteroids (accretion). So asteroid is a big pile of rocks.',
    })
    .catch((resp) => {
      expect(resp.status).toBe(422);

      const errors = JSON.parse(resp.response.text);

      const fieldErrors = getErrorsForField(errors, 'details');
      expect(fieldErrors.length).toBeGreaterThan(0); // At least 1 error message

      expect(getErrorsContainingText(fieldErrors, 'long')).toHaveLength(1);
      expect(getErrorsContainingText(fieldErrors, '255')).toHaveLength(1);
    })
));

// Same validator is used to validate PUT requests.
test('/reports PUT also has validation', () => (
  // code below returns promise
  // Fetch list of reports
  request.get(`${APP_URL}/reports`)
    .then(resp => (
      // Fetch first report in the list
      request.get(`${APP_URL}/reports/${resp.body[0]._id}`) // eslint-disable-line
    ))
    .then(resp2 => (
      // Set update request with obviously invalid value
      request.put(`${APP_URL}/reports/${resp2.body._id}`) // eslint-disable-line
        .set('Content-Type', 'application/json')
        .send({})
    ))
    .catch((resp3) => {
      expect(resp3.status).toBe(422);
    })
));
