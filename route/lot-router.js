'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('parkify:lot-router');

const Lot = require('../model/lot.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const lotRouter = module.exports = Router();

lotRouter.post('/api/lot', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/lot');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  request.body.userID = request.user._id;

  Lot.create(request.body)
  .then( lot => response.json(lot))
  .catch(next);
});

lotRouter.get('/api/lot/:lotID', bearerAuth, function(request, response, next) {
  debug('GET: api/lot/:lotID');

  if (Object.keys(request.body).length === 0) return next (createError(400, 'Bad Request'));

  Lot.findById(request.params.id)
  .then( lot => {
    if (!lot) return next(createError(404, 'No Lot Found'));
    response.json(lot);
  })
  .catch(err => next(createError(404, err.message)));
});

lotRouter.put('/api/lot/:lotID', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: api/lot/:lotID');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Lot.findByIdAndUpdate(request.params.id, request.body, { new: true })
  .then( lot => response.json(lot))
  .catch( err => next(createError(404, err.message)));
});

lotRouter.delete('/api/lot/:lotID', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/lot/:ID');

  Lot.findByIdAndRemove(request.params.id)
  .then( () => response.sendStatus(204))
  .catch( err => next(createError(404, err.message)));
});
