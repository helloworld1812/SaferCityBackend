const REQUIRED_VALIDATION_ERROR_MESSAGE = 'Field is required but no value is provided';

const reportValidator = (req, res, next) => {
  req.checkBody('title', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('location', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('time', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('time', 'Provided time is not a valid time').isDate();

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      next();
    } else {
      res.status(422).json(result.array());
    }
  });
};

module.exports = { reportValidator };
