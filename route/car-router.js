'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('parkify:car-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Car = require('../model/car.js');

const carRouter = module.exports = Router();

carRouter.post('/api/car/:carID', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/car/:carID');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  request.body.userID = request.user._id;

  Car.create(request.body)
  .then( car => response.json(car))
  .catch(next);
});

carRouter.get('/api/car/:carID', bearerAuth, function(request, response, next) {
  debug('GET: /api/car/:carID');

  Car.findById(request.params.id)
  .then( car => {
    if (!car) return next(createError(404, 'No Car Found'));
    response.json(car);
  })
  .catch(err => next(createError(404, err.message)));
});

carRouter.put('/api/car/:carID', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: /api/car/:carID');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Car.findByIdAndUpdate(request.params.id, request.body, { new: true })
  .then( contact => response.json(contact))
  .catch( err => next(createError(404, err.message)));
});

carRouter.delete('/api/car/:carID', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/car/:carID');

  Car.findByIdAndRemove(request.params.id)
  .then( () => response.sendStatus(204))
  .catch( err => next(createError(404, err.message)));
});
