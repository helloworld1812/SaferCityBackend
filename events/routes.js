const express = require('express');
const service = require('./service');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
  const event = req.body;
  service.create(event).then((createdEvent) => { res.json(createdEvent.id); });
});

router.get('/', (req, res) => {
  service.list().then((events) => { res.json(events); });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  service.find(id)
    .then((event) => { res.json(event); })
    .catch(() => { res.status(404).send(`No event with id "${id}" exists`); });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const event = req.body;
  service.update(id, event)
    .then(() => { res.send(); })
    .catch(() => { res.status(404).send(`No event with id "${id}" exists`); });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  service.remove(id)
    .then(() => { res.send(); })
    .catch(() => { res.status(404).send(`No event with id "${id}" exists`); });
});

module.exports = router;
