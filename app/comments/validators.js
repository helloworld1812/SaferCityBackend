const REQUIRED_VALIDATION_ERROR_MESSAGE = 'Field is required but no value is provided';

const commentValidator = (req, res, next) => {
  req.checkBody('text', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('text', 'Must be less than 255 chars long').len(0, 255);

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      next();
    } else {
      res.status(422).json(result.array());
    }
  });
};

module.exports = { commentValidator };
