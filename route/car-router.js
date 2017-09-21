'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('parkify:car-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Car = require('../model/car.js');

const carRouter = module.exports = Router();

carRouter.post('/api/car', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/car');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  request.body.userID = request.user._id;

  Car.create(request.body)
  .then( car => response.json(car))
  .catch(next);
});

carRouter.get('/api/car/:carID', bearerAuth, function(request, response, next) {
  debug('GET: /api/car/:carID');

  Car.findById(request.params.carID)
  .then( car => {
    if (!car) return next(createError(404, 'No Car Found'));
    response.json(car);
  })
  .catch( error => next(createError(404, error.message)));
});

carRouter.get('/api/cars', bearerAuth, function(request, response, next) {
  debug('GET: /api/cars');

  Car.find({userID: request.user._id})
  .then(cars => response.send(cars))
  .catch(error => next(createError(404, error.message)));
});

carRouter.put('/api/car/:carID', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: /api/car/:carID');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Car.findByIdAndUpdate(request.params.carID, request.body, { new: true })
  .then( contact => response.json(contact))
  .catch( error => next(createError(404, error.message)));
});

carRouter.delete('/api/car/:carID', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/car/:carID');

  Car.findByIdAndRemove(request.params.carID)
  .then( () => response.sendStatus(204))
  .catch( error => next(createError(404, error.message)));
});