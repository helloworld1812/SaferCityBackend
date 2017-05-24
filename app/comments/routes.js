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

router.post('/', validators.commentValidator, (req, res) => {
  const comment = req.body;
  service.create(comment)
    .then((createdComment) => { res.json(createdComment.id); });
});

router.get('/', validators.listCommentsValidator, (req, res) => {
  const reportId = req.query.reportId;
  const before = getDateOrNow(req.query.before);
  service.list(reportId, before)
    .then((comments) => { res.json(comments); });
});

router.put('/:id', validators.commentValidator, (req, res) => {
  const id = req.params.id;
  const comment = req.body;
  service.update(id, comment)
    .then(() => { res.send(); })
    .catch(() => { res.status(404).send(`No comment with id "${id}" exists`); });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  service.remove(id)
    .then(() => { res.send(); })
    .catch(() => { res.status(404).send(`No comment with id "${id}" exists`); });
});

module.exports = router;
