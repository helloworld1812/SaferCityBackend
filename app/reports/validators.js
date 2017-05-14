const REQUIRED_VALIDATION_ERROR_MESSAGE = 'Field is required but no value is provided';

const reportValidator = (req, res, next) => {
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
      next();
    } else {
      res.status(422).json(result.array());
    }
  });
};

module.exports = { reportValidator };
