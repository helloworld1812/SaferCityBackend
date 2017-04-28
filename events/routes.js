const express = require('express');
const service = require('./service');

const router = express.Router();

router.post('/', (req, res) => {
  res.status(500).send('Not implemented');
});

router.get('/', (req, res) => {
  res.status(500).send('Not implemented');
});

router.get('/:id', (req, res) => {
  res.status(500).send('Not implemented');
});

router.put('/:id', (req, res) => {
  res.status(500).send('Not implemented');
});

router.delete('/:id', (req, res) => {
  res.status(500).send('Not implemented');
});

router.get('/', () => service.list());

module.exports = router;
