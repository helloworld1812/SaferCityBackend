/* global test, expect, beforeAll, afterAll, jest */
const request = require('superagent');
const mongoose = require('mongoose');

// Load and run the app
const serverPromise = require('./app');

const APP_URL = 'http://127.0.0.1:8080';
let runningApp = null;

beforeAll(() => {
  mongoose.connection.dropDatabase();
  return serverPromise.then((app) => { runningApp = app; });
});

afterAll(() => {
  mongoose.disconnect();
  runningApp.close();
});

// Please note: test order matters

const report1 = { title: 'Report 1' };
const report2 = { title: 'Report 2' };
let id1;

test('/reports POST returns id of newly created item', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send(report1)
    .then((resp) => {
      expect(resp.body).toBeDefined();
      id1 = resp.body;
    })
));

test('/reports POST returns id of newly created item (one more time)', () => (
  // code below returns promise
  request.post(`${APP_URL}/reports`)
    .set('Content-Type', 'application/json')
    .send(report2)
    .then((resp) => {
      expect(resp.body).toBeDefined();
    })
));

test('/reports GET returns 2 items', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports`)
    .then((resp) => {
      const receivedReports = resp.body;
      expect(receivedReports.length).toEqual(2);
      const receivedReport1 = receivedReports[0];
      expect(receivedReport1.title).toEqual(report1.title);
      const receivedReport2 = receivedReports[1];
      expect(receivedReport2.title).toEqual(report2.title);
    })
));

test('/reports/:id GET returns report for existing id', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports/${id1}`)
    .then((res) => {
      const receivedReport = res.body;
      expect(receivedReport.title).toEqual(report1.title);
    })
));

test('/reports/:id GET returns 404 error for non-existing id', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports/-1`)
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

test('/reports/:id PUT updates existing id', () => {
  report1.title = 'Updated report';
  return request.put(`${APP_URL}/reports/${id1}`)
    .set('Content-Type', 'application/json')
    .send(report1)
    .then(() => (
      // When we've updated we would like to check that report is indeed updated
      // So we issue a request to fetch just modified data...
      request.get(`${APP_URL}/reports/${id1}`)
    ))
    .then((res) => {
      // ... and then check that it's indeed equal to an updated report
      const receivedReport = res.body;
      expect(receivedReport.title).toEqual(report1.title);
    });
});

test('/reports/:id PUT returns 404 error for non-existing id', () => (
  // code below returns promise
  request.put(`${APP_URL}/reports/-1`)
    .set('Content-Type', 'application/json')
    .send(report1)
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

test('/reports/:id DELETE removes the entity with existing id', () => (
  request.delete(`${APP_URL}/reports/${id1}`)
    .then(() => (
      // When we've removed the report we would like to check that it's indeed removed
      // So we issue a request to fetch list of reports...
      request.get(`${APP_URL}/reports`)
    ))
    .then((resp) => {
      const reports = resp.body;
      expect(reports.length).toEqual(1);
    })
));

test('/reports/:id DELETE return 404 error for non-existing id', () => (
  request.delete(`${APP_URL}/reports/-1`)
    .then(() => (
      // When we've removed the report we would like to check that it's indeed removed
      // So we issue a request to fetch list of reports...
      request.get(`${APP_URL}/reports`)
    ))
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));
