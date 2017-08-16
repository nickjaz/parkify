'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:price-router');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Price = require('../model/price.js');

const priceRouter = module.exports = Router();

priceRouter.post('/api/lot/:lotID/spot/:spotID/price', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/price');

  Price.create(request.body)
  .then(price => {
    response.json(price);
  })
  .catch(error => {
    error = createError(400, error.message);
    next(error);
  });
});

priceRouter.get('/api/lot/:lotID/spot/:spotID/price/:priceID', bearerAuth, function(request, response, next) {
  debug('GET: /api/price/:id');

  Price.findById(request.params.id)
  .then(price => {
    if (!price) return next(createError(404, 'No price found'));
    response.json(price);
  })
  .catch(err => next(createError(404, err.message)));
});

priceRouter.put('/api/lot/:lotID/spot/:spotID/price/:priceID', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: /api/price/:id');

  Price.findByIdAndUpdate(request.params.id, request.body, { new: true })
  .then(price => response.json(price))
  .catch(err => next(createError(404, err.message)));
});

priceRouter.delete('/api/lot/:lotID/spot/:spotID/price/:priceID', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/price/:id');

  Price.findByIdAndRemove(request.params.id)
  .then(() => response.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
