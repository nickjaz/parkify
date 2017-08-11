'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('parkify:car-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Car = require('../model/car.js');

const carRouter = module.exports = Router();

carRouter.post('/api/car/:carID', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/car/:carID');

  if (Object.keys(req.body).length === 0) return next(createError(400, 'Bad Request'));

  req.body.userID = req.user._id;

  new Car(req.body).save()
  .then( car => res.json(car))
  .catch(next);
});

carRouter.get('/api/car/:carID', bearerAuth, function(req, res, next) {
  debug('GET: /api/car/:carID');

  Car.findById(req.params.id)
  .then( car => res.json(car))
  .catch(err => next(createError(404, err.message)));
});

carRouter.put('/api/car/:carID', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/car/:carID');

  if (Object.keys(req.body).length === 0) return next(createError(400, 'Bad Request'));

  Car.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( contact => res.json(contact))
  .catch( err => next(createError(404, err.message)));
});

carRouter.delete('/api/car/:carID', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/car/:carID');

  Car.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
