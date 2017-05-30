/**
 * Integration test suite for reports entity.
 * Intended to be required from app.test.js.
 */

/* global describe, test, expect */
const request = require('superagent');
const mongoose = require('mongoose');

const APP_URL = global.appUrl;

// # Test data

const reports = [{
  title: 'Ivan departure party',
  location: 'Santana Row',
  time: new Date(2017, 2, 11, 20, 0, 0, 0),  // make sure times are not sorted
  details: 'Bar surfing',
  userId: mongoose.Types.ObjectId(),
}, {
  title: 'Car accident',
  location: '101',
  time: new Date(2017, 0, 15, 11, 15, 0, 0),  // make sure times are not sorted
  details: 'Two cars',
  dangerous: true,
  userId: mongoose.Types.ObjectId(),
}, {
  title: 'Festival happening',
  location: 'Shoreline Amphiteatre',
  time: new Date(2017, 4, 15, 11, 15, 0, 0), // make sure times are not sorted
  details: 'Muse should be there',
  userId: mongoose.Types.ObjectId(),
}];

/** Utility function to return id of index-th item */
const id = index => reports[index].id;
/** Utility function to return time of index-th item */
const time = index => reports[index].time;
/** Utility function to return item with given id */
const reportById = itemId => reports.filter(r => String(r.id) === itemId)[0];


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

// ## Make sure error is returned for invalid reports
describe('"Reports" validators', () => {
  require('./validators.testsuite'); // eslint-disable-line global-require
});

// ## Make sure we added them and are able to read them
test('/reports GET returns items', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports`)
    .then((resp) => {
      const receivedReports = resp.body;
      expect(receivedReports.length).toEqual(reports.length);
      receivedReports.forEach((receivedReport) => {
        const report = reportById(receivedReport._id); // eslint-disable-line
        expect(report).toBeDefined();
        // Check all properties
        expect(receivedReport.title).toEqual(report.title);
        expect(receivedReport.location).toEqual(report.location);
        expect(receivedReport.time).toEqual(report.time.toISOString());
        expect(receivedReport.details).toEqual(report.details);
        expect(receivedReport.dangerous).toEqual(report.dangerous);
      });
    })
));

// ## Make sure list of reports is sorted by time with newest on top
test('/reports GET returns items sorted by time DESC', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports`)
    .then((resp) => {
      const receivedReports = resp.body;
      let lastTime = Infinity;
      receivedReports.forEach((receivedReport) => {
        const reportTime = (new Date(receivedReport.time)).getTime();
        expect(reportTime).toBeLessThan(lastTime);
        lastTime = reportTime;
      });
    })
));

// ## Make sure before param works as expected
test('/reports?before={time} GET returns items happened before specified time', () => (
  // code below returns promise
  request.get(`${APP_URL}/reports?before=${time(2).getTime()}`)
    .then((resp) => {
      const receivedReports = resp.body;
      receivedReports.forEach((receivedReport) => {
        const reportTime = (new Date(receivedReport.time)).getTime();
        expect(reportTime).toBeLessThan(time(2).getTime());
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
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
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
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
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
    .then(resp => (Promise.reject(resp))) // Request shouldn't be successful - reject it
    .catch((res) => {
      expect(res.status).toBe(404);
    })
));
