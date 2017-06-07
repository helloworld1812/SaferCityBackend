const express = require('express');
const mongo = require('./mongo');
const expressValidator = require('express-validator');

const reportsRoutes = require('./reports/routes');
const commentsRoutes = require('./comments/routes');
const usersRoutes = require('./users/routes');

require('dotenv').config();

const app = express();

app.use(expressValidator());
app.use('/reports', reportsRoutes);
app.use('/comments', commentsRoutes);
app.use('/users', usersRoutes);

const serverPromise = Promise.all([mongo.connect()])
  .then(() => (Promise.resolve(app.listen(process.env.PORT))))
  .then((server) => {
    console.log('SaferCity backend started');
    return server;
  }).catch((error) => {
    console.log(`SaferCity backend failed to start: ${error}`);
  });

module.exports = serverPromise;
