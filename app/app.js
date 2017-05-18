const express = require('express');
const mongo = require('./mongo');
const expressValidator = require('express-validator');

const reportsRoutes = require('./reports/routes');
const commentsRoutes = require('./comments/routes');

require('dotenv').config();

const app = express();

app.use(expressValidator());
app.use('/reports', reportsRoutes);
app.use('/comments', commentsRoutes);

const serverPromise = Promise.all([mongo.connect()])
  .then(() => (Promise.resolve(app.listen(8080))))
  .then((server) => {
    console.log('SaferCity backend started');
    return server;
  }).catch((error) => {
    console.log(`SaferCity backend failed to start: ${error}`);
  });

module.exports = serverPromise;
