'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:timeslot-router');
const jsonParser = require('body-parser').json();
const Spot = require('../model/spot.js');
const Timeslot = require('../model/timeslot.js');

const timeslotRouter = module.exports = new Router();

timeslotRouter.post('/api/lot/:lotID/spot/:spotID/timeslot', jsonParser, function(request, response, next) {
  debug('POST: /api/lot/:lotID/spot/:spotID/timeslot');

  Spot.findByIdAndAddTimeslot(request.params.spotID, request.body)
  .then(timeslot => response.json(timeslot))
  .catch(next);
});

timeslotRouter.get('/api/lot/:lotID/spot/:spotID/timeslot/:id', jsonParser, function(request, response, next) {
  debug('GET: /api/lot/:lotID/spot/:spotID/timeslot/:id');

  Timeslot.findById(request.params.id)
    .then(timeslot => response.json(timeslot))
    .catch(err => next(createError(404, err.message)));
});

timeslotRouter.put('/api/lot/:lotID/spot/:spotID/timeslot/:id', jsonParser, function(request, response, next) {
  debug('PUT: /api/lot/:lotID/spot/:spotID/timeslot/:id');

  if(!request.body.name) return next(createError(400, response.message));

  Timeslot.findByIdAndUpdate(request.params.id, request.body, { 'new': true })
  .then(spot => response.json(spot))
  .catch(err => {
    if(err.name !== 'ValidationError') {
      err = createError(404, err.message);
    }
    next(err);
  });
});

timeslotRouter.delete('/api/lot/:lotID/spot/:spotID/timeslot/:id', function(request, response, next) {
  debug('DELETE: /api/lot/:lotID/spot/:spotID/timeslot/:id');

  Timeslot.findByIdAndRemove(request.params.id)
  .then(() => response.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
