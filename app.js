const express = require('express');
const eventsRoutes = require('./events/routes');

const app = express();

app.use('/events', eventsRoutes);

const server = app.listen(8080);

module.exports = server;
