'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:feedback-router');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Feedback = require('../model/feedback.js');

const feedbackRouter = module.exports = Router();

feedbackRouter.post('/api/feedback', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/feedback');

  if(Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Feedback.create(request.body)
  .then(feedback => {
    response.set('Location', `/api/feedback/${feedback._id}`);
    response.sendStatus(201);
  })
  .catch(next);
});

feedbackRouter.get('/api/feedback/:id', function(request, response, next) {
  debug('GET: /api/feedback/:id');

  Feedback.findById(request.params.id)
  .then(feedback => {
    if (!feedback) return next(createError(404, 'No feedback found'));
    response.json(feedback);
  })
  .catch(err => next(createError(404, err.message)));
});

feedbackRouter.put('/api/feedback/:id', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: /api/feedback/:id');

  if(Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Feedback.findByIdAndUpdate(request.params.id, request.body, { new: true })
  .then( feedback => response.json(feedback))
  .catch( err => next(createError(404, err.message)));
});

feedbackRouter.delete('/api/feedback/:id', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/feedback/:id');

  Feedback.findByIdAndRemove(request.params.id)
  .then( () => response.sendStatus(204))
  .catch( err => next(createError(404, err.message)));
});
