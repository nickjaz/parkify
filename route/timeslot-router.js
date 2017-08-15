'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:timeslot-router');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const Spot = require('../model/spot.js');
const Timeslot = require('../model/timeslot.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const timeslotRouter = module.exports = new Router();

timeslotRouter.post('/api/lot/:lotID/spot/:spotID/timeslot', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/lot/:lotID/spot/:spotID/timeslot');

  Spot.findByIdAndAddTimeslot(request.params.spotID, request.body)
  .then(timeslot => response.json(timeslot))
  .catch(next);
});

timeslotRouter.get('/api/lot/:lotID/spot/:spotID/timeslot/:id', bearerAuth, jsonParser, function(request, response, next) {
  debug('GET: /api/lot/:lotID/spot/:spotID/timeslot/:id');

  Timeslot.findById(request.params.id)
  .then(timeslot => {
    if(!timeslot) return next(createError(404, 'timeslot not found'));
    response.json(timeslot);
  })
  .catch(err => next(createError(404, err.message)));
});

timeslotRouter.put('/api/lot/:lotID/spot/:spotID/timeslot/:id', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: /api/lot/:lotID/spot/:spotID/timeslot/:id');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Timeslot.findByIdAndUpdate(request.params.id, request.body, { 'new': true })
  .then(spot => response.json(spot))
  .catch(err => {
    if(err.name !== 'ValidationError') {
      err = createError(404, err.message);
    }
    next(err);
  });
});

timeslotRouter.delete('/api/lot/:lotID/spot/:spotID/timeslot/:id', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/lot/:lotID/spot/:spotID/timeslot/:id');

  Timeslot.findByIdAndRemove(request.params.id)
  .then(() => response.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
