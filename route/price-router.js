'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:price-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');
const generatePrice = require('../test/prediction/generate-price.js');

const priceRouter = module.exports = Router();

priceRouter.get('/api/price', bearerAuth, function(request, response, next) {

  debug('GET: /api/price');

  let { startTime, endTime } = request.query;

  if (!startTime) {
    return next(createError(400, 'No start time provided.'));
  }

  if (!endTime) {
    return next(createError(400, 'No end time provided.'));
  }

  if (startTime > endTime) {
    return next(createError(400, 'The start time must be a time before the end time.'));
  }

  let start = new Date(startTime);
  let end = new Date(endTime);

  if (isNaN(start.getTime())) {
    return next(createError(400, 'The provided startTime is invalid.'));
  }

  if (isNaN(end.getTime())) {
    return next(createError(400, 'The provided endTime is invalid.'));
  }

  try {
    let price = generatePrice(start, end);
    response.send({ price });
  }
  catch (error) {
    return next(createError(400, error.message));
  }

});
