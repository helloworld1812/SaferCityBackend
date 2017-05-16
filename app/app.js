const express = require('express');
const reportsRoutes = require('./reports/routes');
const mongo = require('./mongo');
const expressValidator = require('express-validator');

console.log(require('dotenv').config());

const app = express();

app.use(expressValidator());
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
