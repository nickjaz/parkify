'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('parkify:lot-router');

const Lot = require('../model/lot.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const geocoder = require('../lib/geocoder.js');

const lotRouter = module.exports = Router();

lotRouter.post('/api/lot', bearerAuth, jsonParser, geocoder, function(request, response, next) {
  debug('POST: /api/lot');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  request.body.userID = request.user._id;
  console.log(request.body);

  Lot.create(request.body)
  .then( lot => {
    response.set('Location', `/api/lot/${lot._id}`);
    response.sendStatus(201);
  })
  .catch(next);
});

lotRouter.get('/api/lot/:id', bearerAuth, function(request, response, next) {
  debug('GET: api/lot/:lotID');

  Lot.findById(request.params.id)
  .then( lot => {
    if (!lot) return next(createError(404, 'Lot Not Found'));
    response.json(lot);
  })
  .catch(err => next(createError(404, err.message)));
});

lotRouter.put('/api/lot/:id', bearerAuth, jsonParser, geocoder, function(request, response, next) {
  debug('PUT: api/lot/:lotID');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Lot.findByIdAndUpdate(request.params.id, request.body, { new: true })
  .then( lot => response.json(lot))
  .catch( err => next(createError(404, err.message)));
});

lotRouter.delete('/api/lot/:id', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/lot/:ID');

  Lot.findByIdAndRemove(request.params.id)
  .then( () => response.sendStatus(204))
  .catch( err => next(createError(404, err.message)));
});
