const express = require('express');
const service = require('./service');
const bodyParser = require('body-parser');

const REQUIRED_VALIDATION_ERROR_MESSAGE = 'Field is required but no value is provided';

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
  req.checkBody({
    title: {
      notEmpty: true,
      errorMessage: REQUIRED_VALIDATION_ERROR_MESSAGE,
    },
    location: {
      notEmpty: true,
      errorMessage: REQUIRED_VALIDATION_ERROR_MESSAGE,
    },
    time: {
      notEmpty: true,
      errorMessage: REQUIRED_VALIDATION_ERROR_MESSAGE,
      isDate: {
        errorMessage: 'Provided time is not a valid time',
      },
    },
  });
  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      const report = req.body;
      service.create(report).then((createdReport) => {
        res.json(createdReport.id);
      });
    } else {
      res.status(422).json(result.array());
    }
  });
});

router.get('/', (req, res) => {
  service.list().then((reports) => { res.json(reports); });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  service.find(id)
    .then((report) => { res.json(report); })
    .catch(() => { res.status(404).send(`No report with id "${id}" exists`); });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const report = req.body;
  service.update(id, report)
    .then(() => { res.send(); })
    .catch(() => { res.status(404).send(`No report with id "${id}" exists`); });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  service.remove(id)
    .then(() => { res.send(); })
    .catch(() => { res.status(404).send(`No report with id "${id}" exists`); });
});

module.exports = router;
