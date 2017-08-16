'use strict';

const createError = require('http-errors');
const debug = require('debug')('parkify:error-handler');

module.exports = function(error, request, response, next) {
  debug('Error handler.');

  if (error.name === 'ValidationError') {
    error = createError(400, error.message);
  }
  
  if (!error.status) {
    error = createError(500, error.message);
  }

  debug('Error name: ' + error.name);
  debug('Error message: ' + error.message);

  response.status(error.status).send(error.name);
  next();
};