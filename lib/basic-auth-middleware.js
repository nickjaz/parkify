'use strict';

const createError = require('http-errors');
const debug = require('debug')('parkify:basic-auth-middleware');

module.exports = function (request, response, next) {
  debug('basic auth');

  var authHeader = request.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'Authorization header required'));
  }
  var base64str = authHeader.split('Basic')[1];
  if (!base64str) {
    return next(createError(401, 'Name and password required'));
  }
  var utf8str = new Buffer(base64str, 'base64').toString();
  var authArr = utf8str.split(':');

  request.auth = {
    name: authArr[0],
    password: authArr[1]
  }
  if (!request.auth.name) {
    return next(createError(401, 'Name required'));
  }
  if (!request.auth.password) {
    return next(createError(401, 'Password required'));
  }
  next();
}