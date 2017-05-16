/* global test, expect, beforeAll, afterAll, jest */
const mongoose = require('mongoose');

// # Setup

// Load and run the app
const serverPromise = require('./app');

global.appUrl = 'http://127.0.0.1:8080';

let runningApp = null;

beforeAll(() => {
  mongoose.connection.dropDatabase();
  return serverPromise.then((app) => { runningApp = app; });
});

afterAll(() => {
  mongoose.disconnect();
  runningApp.close();
});


require('./reports/reports.testsuite.js');
