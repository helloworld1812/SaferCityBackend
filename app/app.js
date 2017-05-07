const express = require('express');
const reportsRoutes = require('./reports/routes');
const mongo = require('./mongo');

const app = express();

app.use('/reports', reportsRoutes);

const serverPromise = Promise.all([mongo.connect()])
  .then(() => (Promise.resolve(app.listen(8080))))
  .then((server) => {
    console.log('SaferCity backend started');
    return server;
  }).catch((error) => {
    console.log(`SaferCity backend failed to start: ${error}`);
  });

module.exports = serverPromise;
