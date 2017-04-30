const express = require('express');
const eventsRoutes = require('./events/routes');
const mongo = require('./mongo');

const app = express();

app.use('/events', eventsRoutes);

const serverPromise = Promise.all([mongo.connect()])
  .then(() => (Promise.resolve(app.listen(8080))))
  .then((server) => {
    console.log('SaferCity backend started');
    return server;
  }).catch((error) => {
    console.log(`SaferCity backend failed to start: ${error}`);
  });

module.exports = serverPromise;
