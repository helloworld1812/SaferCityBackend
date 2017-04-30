const express = require('express');
const service = require('./service');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
  const event = req.body;
  const id = service.create(event);
  res.json(id);
});

router.get('/', (req, res) => {
  const events = service.list();
  res.json(events);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  try {
    const event = service.find(id);
    res.json(event);
  } catch (e) {
    res.status(404).send(`No event with id "${id}" exists`);
  }
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  try {
    const event = req.body;
    service.update(id, event);
    res.send();
  } catch (e) {
    res.status(404).send(`No event with id "${id}" exists`);
  }
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  try {
    service.remove(id);
    res.send();
  } catch (e) {
    res.status(404).send(`No event with id "${id}" exists`);
  }
});

module.exports = router;
