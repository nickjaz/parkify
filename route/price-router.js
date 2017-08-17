'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:price-router');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const Lot = require('../model/lot.js')
const Price = require('../model/price.js');

const priceRouter = module.exports = Router();

priceRouter.post('/api/lot/:lotID/price', bearerAuth, jsonParser, function(request, response, next) {
  debug('/api/lot/:lotID/price');

  Lot.findByIdAndAddPrice(request.params.lotID, request.body)
  .then(price => {
    response.status(201).json(price);
  })
  .catch(next);
});

priceRouter.get('/api/lot/:lotID/price/:id', bearerAuth, function(request, response, next) {
  debug('GET: /api/lot/:lotID/price/:id');

  Price.findById(request.params.id)
  .populate('prices')
  .then(price => {
    if (!price) return next(createError(404, 'No price found'));
    response.json(price);
  })
  .catch(err => next(createError(404, err.message)));
});
//
// priceRouter.put('/api/lot/:lotID/price/:id', bearerAuth, jsonParser, function(request, response, next) {
//   debug('PUT: /api/lot/:lotID/price/:id');
//
//   Price.findByIdAndUpdate(request.params.id, request.body, { new: true })
//   .then(price => response.json(price))
//   .catch(err => next(createError(404, err.message)));
// });
//
// priceRouter.delete('/api/lot/:lotID/price/:id', bearerAuth, function(request, response, next) {
//   debug('DELETE: /api/lot/:lotID/price/:id');
//
//   Price.findByIdAndRemove(request.params.id)
//   .then(() => response.sendStatus(204))
//   .catch(err => next(createError(404, err.message)));
// });
