const REQUIRED_VALIDATION_ERROR_MESSAGE = 'Field is required but no value is provided';

const reportValidator = (req, res, next) => {
  req.checkBody('title', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('title', 'Must be less than 80 chars long').len(0, 80);
  req.checkBody('location', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('location', 'Must be less than 80 chars long').len(0, 80);
  req.checkBody('time', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('time', 'Provided time is not a valid time').isDate();
  req.checkBody('details', 'Must be less than 255 chars long').len(0, 255);

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      next();
    } else {
      res.status(422).json(result.array());
    }
  });
};

const listReportsValidator = (req, res, next) => {
  req.checkQuery('before', '"before" is not a valid timestamp').optional().isInt();

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      next();
    } else {
      res.status(422).json(result.array());
    }
  });
}

module.exports = { reportValidator, listReportsValidator };
