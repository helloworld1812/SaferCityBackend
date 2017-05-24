const express = require('express');
const service = require('./service');
const bodyParser = require('body-parser');
const validators = require('./validators');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/** Utility function that returns date for provided timestamp or now if it's undefined */
const getDateOrNow = (timestamp) => {
  if (timestamp) {
    return new Date(parseInt(timestamp, 10));
  }
  return Date.now();
};

router.post('/', validators.reportValidator, (req, res) => {
  const report = req.body;
  service.create(report)
    .then((createdReport) => { res.json(createdReport.id); });
});

router.get('/', validators.listReportsValidator, (req, res) => {
  const before = getDateOrNow(req.query.before);
  service.list(before)
    .then((reports) => { res.json(reports); });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  service.find(id)
    .then((report) => { res.json(report); })
    .catch(() => { res.status(404).send(`No report with id "${id}" exists`); });
});

router.put('/:id', validators.reportValidator, (req, res) => {
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
