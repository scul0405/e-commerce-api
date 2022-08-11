const jwt = require('jsonwebtoken');

module.exports = (id) =>
  jwt.sign(id, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TIME_EXPIRES,
  });
