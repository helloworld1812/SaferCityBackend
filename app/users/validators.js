const REQUIRED_VALIDATION_ERROR_MESSAGE = 'Field is required but no value is provided';

const userValidator = (req, res, next) => {
  req.checkBody('name', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      next();
    } else {
      res.status(422).json(result.array());
    }
  });
};

module.exports = { userValidator };
