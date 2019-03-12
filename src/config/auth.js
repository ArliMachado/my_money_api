const jwt = require('jsonwebtoken');
const env = require('../.env');

module.exports = (req, res, next) => {
  const AUTHORIZATION = 'authorization';
  // CORS preflight request
  if (req.method === 'OPTIONS') {
    next();
  } else {
    const token = req.body.token || req.query.token || req.headers[AUTHORIZATION];
    if (!token) {
      return res.status(403).send({ errors: ['No token provided.'] });
    }
    jwt.verify(token, env.authSecret, (err, decoded) => {
      if (err) {
        return res.status(403).send({ errors: ['Failed to authenticate token.'] });
      }
      //req.decoded = decoded;
      next();
    });
  }
};
