const express = require('express');

const app = express();

app.get('/api/events', (req, res) => {
  const event = {
    title: 'Free wine!',
  };
  res.json(event);
});

const server = app.listen(8080);

module.exports = server;
