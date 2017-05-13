/* global test, expect, beforeAll, afterAll, jest */
const request = require('superagent');
const mongoose = require('mongoose');

// # Setup

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


// # Test data

const reports = [{
  title: 'Ivan departure party',
  location: 'Santana Row',
  time: new Date(2017, 5, 11, 20, 0, 0, 0),
  details: 'Bar surfing',
}, {
  title: 'Car accident',
  location: '101',
  time: new Date(2017, 3, 15, 11, 15, 0, 0),
  details: 'Two cars',
  dangerous: true,
}, {
  title: 'Festival happening',
  location: 'Shoreline Amphiteatre',
  time: new Date(2017, 7, 15, 11, 15, 0, 0),
  details: 'Muse should be there',
}];

/** Utility function to return id of index-th report */
const id = index => reports[index].id;


// # Tests
// Please note: test order matters

// ## Put test data in database
test('/reports POST returns id of newly created item', () => (
  // code below returns promise
  Promise.all(Object.keys(reports).map(index => (
    request.post(`${APP_URL}/reports`)
      .set('Content-Type', 'application/json')
      .send(reports[index])
      .then((resp) => {
        expect(resp.body).toBeDefined();
        reports[index].id = resp.body;
      })
  )))
));

// ## Make sure we added them all and reading them
test('/reports GET returns 3 items', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports`)
    .then((resp) => {
      const receivedReports = resp.body;
      expect(receivedReports.length).toEqual(reports.length);
      receivedReports.forEach((receivedReport) => {
        const reportsWithSameTitle = reports.filter(r => r.title === receivedReport.title);
        expect(reportsWithSameTitle.length).toBe(1);
        const report = reportsWithSameTitle[0];
        expect(receivedReport.title).toEqual(report.title);
        expect(receivedReport.location).toEqual(report.location);
        expect(new Date(receivedReport.time)).toEqual(report.time);
        expect(receivedReport.details).toEqual(report.details);
        expect(receivedReport.dangerous).toEqual(report.dangerous);
      });
    })
));

// ## Check if we can grab object by id
test('/reports/:id GET returns report for existing id', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports/${id(0)}`)
    .then((res) => {
      const receivedReport = res.body;
      expect(receivedReport.title).toEqual(reports[0].title);
    })
));

// ## But non-existing id returns 404
test('/reports/:id GET returns 404 error for non-existing id', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports/-1`)
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

// ## Check if we can update object by id
test('/reports/:id PUT updates existing id', () => {
  reports[0].title = 'Party';
  return request.put(`${APP_URL}/reports/${id(0)}`)
    .set('Content-Type', 'application/json')
    .send(reports[0])
    .then(() => (
      // When we've updated we would like to check that report is indeed updated
      // So we issue a request to fetch just modified data...
      request.get(`${APP_URL}/reports/${id(0)}`)
    ))
    .then((res) => {
      // ... and then check that it's indeed equal to an updated report
      const receivedReport = res.body;
      expect(receivedReport.title).toEqual(reports[0].title);
    });
});

// ## But update by non-existing id returns 404
test('/reports/:id PUT returns 404 error for non-existing id', () => (
  // code below returns promise
  request.put(`${APP_URL}/reports/-1`)
    .set('Content-Type', 'application/json')
    .send(reports[0])
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));

// ## Check if we can remove object
test('/reports/:id DELETE removes the entity with existing id', () => (
  request.delete(`${APP_URL}/reports/${id(1)}`)
    .then(() => (
      // When we've removed the report we would like to check that it's indeed removed
      // So we issue a request to fetch list of reports...
      request.get(`${APP_URL}/reports`)
    ))
    .then((resp) => {
      const updatedReports = resp.body;
      expect(updatedReports.length).toEqual(reports.length - 1);
    })
));

// ## But if we remove by non-existing id we get 404
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
