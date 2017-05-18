const express = require('express');
const service = require('./service');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
  const comment = req.body;
  service.create(comment).then((createdComment) => {
    res.json(createdComment.id);
  });
});

router.get('/', (req, res) => {
  const reportId = req.query.reportId;
  if (!reportId) {
    res.status(501).send('Fetching all comments is not supported');
  } else {
    service.list({reportId}).then((comments) => {
      res.json(comments);
    });
  }
});

router.put('/:id', (req, res) => {
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
