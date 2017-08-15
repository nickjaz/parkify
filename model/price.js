'use strict';

const mongoose = require('mongoose');
const debug = require('debug'('parkify:price'));
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Spot = require('./spot.js');

const priceSchema = Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  price: { type: String, required: true},
  LotID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('price', priceSchema);


priceRouter.post('/api/price', bearerAuth, jsonParser, function (request, response, next) {
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

priceRouter.get('/api/price/:id', bearerAuth, function (request, response, next) {
  debug('GET: /api/price/:id');

  Price.findById(request.params.id)
    .then(price => {
      if (!price) return next(createError(404, 'No price found'));
      response.json(price);
    })
    .catch(err => next(createError(404, err.message)));
});

priceRouter.put('/api/price/:id', bearerAuth, jsonParser, function (request, response, next) {
  debug('PUT: /api/price/:id');

  Price.findByIdAndUpdate(request.params.id, request.body, { new: true })
    .then(price => response.json(price))
    .catch(err => next(createError(404, err.message)));
});

priceRouter.delete('/api/price/:id', bearerAuth, function (request, response, next) {
  debug('DELETE: /api/price/:id');

  Price.findByIdAndRemove(request.params.id)
    .then(() => response.sendStatus(204))
    .catch(err => next(createError(404, err.message)));
});