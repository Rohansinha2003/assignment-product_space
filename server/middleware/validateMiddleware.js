const { validationResult } = require('express-validator');

/**
 * Middleware that checks express-validator results.
 * If there are errors, responds with 422 and the error list.
 * Otherwise proceeds to the next handler.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = { validate };
