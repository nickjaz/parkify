'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('parkify:bearer-auth');

const User = require('../model/user.js');

module.exports = function(request, response, next) {
  debug('bearer auth');

  var authHeader = request.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'authorization header required'));
  }

  var token = authHeader.split('Bearer ')[1]
  if (!token) {
    return next(createError(402, 'token required'));
  }

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return next(err);

    User.findOne({tokenHash: decoded.token})
    .then( user => {
      request.user = user
      .next();
    })
    .catch( err => {
      next(createError(401, err.message))
    })
  });
}
