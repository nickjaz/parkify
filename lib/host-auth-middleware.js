'use strict';

const createError = require('http-errors');
const debug = require('debug')('parkify:host-auth');
const jwt = require('jsonwebtoken');
const User = require('../model/user.js');

const hostAuthentication = function(request, response, next) {
  debug('hostAuth');

  let authorization = request.headers.authorization;

  if (!authorization) {
    let error = createError(401, 'Authorization header not provided.');
    return next(error);
  }

  let authenticationArray = authorization.split('Bearer ');

  if (authenticationArray.length < 2) {
    let error = createError(401, 'Invalid authorization header format.');
    return next(error);
  }

  let token = authenticationArray[1];

  if (!token) {
    let error = createError(401, 'Authentication token not provided.');
    return next(error);
  }

  jwt.verify(token, process.env.APP_SECRET, (error, decoded) => {
    if (error) {
      let error = createError(401, 'Unauthorized token.');
      return next(error);
    }

    User.findOne({tokenHash: decoded.token})
    .then( user => {
      request.user = user;
      next();
    })
    .catch(error => {
      error = createError(401, error.message);
      next(error);
    });
  });
};

module.exports = hostAuthentication;
