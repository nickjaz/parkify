'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:spot-router');
const jsonParser = require('body-parser').json();

const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Spot = require('../model/spot.js');

const spotRouter = module.exports = new Router();

spotRouter.post('/api/lot/:lotID/spot', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/lot/:lotID/spot');

  Spot.create(request.body)
  .then(spot => {
    response.status(201).json(spot);
  })
  .catch(next);
});

spotRouter.get('/api/lot/:lotID/spot/:id', bearerAuth, jsonParser, function(request, response, next) {
  debug('GET: /api/lot/:lotID/spot/:id');

  Spot.findById(request.params.id)
  .then(spot => {
    if(!spot) return next(createError(404, 'spot not found'));
    response.json(spot);
  })
  .catch(err => next(createError(404, err.message)));
});

spotRouter.get('/api/lot/:lotID/spots', bearerAuth, function(request, response, next) {
  debug('GET: /api/lot/:lotID/spots');

  Spot.find({lotID: request.params.lotID})
  .then(spots => response.send(spots))
  .catch(error => next(createError(404, error.message)));
});

spotRouter.put('/api/lot/:lotID/spot/:id', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: /api/lot/:lotID/spot/:id');

  if(!request.body.name) return next(createError(400, response.message));

  Spot.findByIdAndUpdate(request.params.id, request.body, { 'new': true })
  .then(spot => response.json(spot))
  .catch(err => {
    if(err.name !== 'ValidationError') {
      err = createError(404, err.message);
    }
    next(err);
  });
});

spotRouter.delete('/api/lot/:lotID/spot/:id', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/lot/:lotID/spot/:id');

  Spot.findByIdAndRemove(request.params.id)
  .then(() => response.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
