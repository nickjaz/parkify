'use strict';

const createError = require('http-errors');
const debug = require('debug')('parkify:basic-auth-middleware');

module.exports = function(request, response, next) {
  debug('basic authorization');

  var authHeader = request.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'authorization header required'));
  }
  var 
}