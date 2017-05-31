const REQUIRED_VALIDATION_ERROR_MESSAGE = 'Field is required but no value is provided';

const commentValidator = (req, res, next) => {
  req.checkBody('text', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('text', 'Must be less than 255 chars long').len(0, 255);
  req.checkBody('userId', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkBody('userId', 'Must be valid ObjectId').isMongoId();

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      next();
    } else {
      res.status(422).json(result.array());
    }
  });
};

const listCommentsValidator = (req, res, next) => {
  req.checkQuery('reportId', REQUIRED_VALIDATION_ERROR_MESSAGE).notEmpty();
  req.checkQuery('before', '"before" is not a valid timestamp').optional().isInt();

  req.getValidationResult().then((result) => {
    if (result.isEmpty()) {
      next();
    } else {
      res.status(422).json(result.array());
    }
  });
};

module.exports = { commentValidator, listCommentsValidator };
