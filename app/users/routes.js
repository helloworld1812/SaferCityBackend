const express = require('express');
const service = require('./service');
const bodyParser = require('body-parser');
const validators = require('./validators');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', validators.userValidator, (req, res) => {
  const user = req.body;
  service.create(user)
    .then((createdUser) => { res.json(createdUser.id); });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  service.find(id)
    .then(user => ((user) ? res.json(user) : Promise.reject()))
    .catch(() => { res.status(404).send(`No report with id "${id}" exists`); });
});

router.put('/:id', validators.userValidator, (req, res) => {
  const id = req.params.id;
  const user = req.body;
  service.update(id, user)
    .then(() => { res.send(); })
    .catch(() => { res.status(404).send(`No user with id "${id}" exists`); });
});

module.exports = router;
