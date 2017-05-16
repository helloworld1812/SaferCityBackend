/* global describe, test, expect, beforeAll, afterAll, jest */
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

describe('Configuration', () => {
  test('All required env variables are defined', () => {
    expect(process.env.DB_USER).toBeDefined();
    expect(process.env.DB_PASS).toBeDefined();
    expect(process.env.DB_HOST).toBeDefined();
    expect(process.env.DB_NAME).toBeDefined();
  });
});

// We're using the fact that node modules are loaded synchronously (unlike ES6 modules)
// (https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)
// So you can read each "require" as "execute tests in specified file"

describe('"Reports" entity', () => {
  require('./reports/reports.testsuite.js'); // eslint-disable-line global-require
});
