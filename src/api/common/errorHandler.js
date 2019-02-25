const _ = require('lodash');

const parseErrors = (nodeRestfulErrors) => {
  const errors = [];
  _.forIn(nodeRestfulErrors, error => errors.push(error.message));
  return errors;
};

const errosHandler = (req, res, next) => {
  const { bundle } = res.locals;

  if (bundle.errors) {
    const errors = parseErrors(bundle.errors);
    res.status(500).json({ errors });
  } else {
    next();
  }
};

module.exports = errosHandler;
