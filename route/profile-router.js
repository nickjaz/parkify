'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('parkify:profile-router');

const Profile = require('../profile/profile.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();

profileRouter.post('/api/profile', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/profile');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  request.body.userID = request.user._id;

  Profile.create(request.body)
  .then(profile => {
    response.set('Location', `/api/profile/${profile._id}`);
    response.sendStatus(201);
  })
  .catch(next);
});

profileRouter.get('/api/profile/:id', bearerAuth, function(request, response, next) {
  debug('GET: api/profile/:profileID');

  Profile.findById(request.params.id)
  .then(profile => {
    if (!profile) return next(createError(404, 'Profile Not Found'));
    response.json(profile);
  })
  .catch(error => next(createError(404, error.message)));
});

profileRouter.put('/api/profile/:id', bearerAuth, jsonParser, function(request, response, next) {
  debug('PUT: api/lot/:profileID');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  Profile.findByIdAndUpdate(request.params.id, request.body, { new: true })
  .then(profile => response.json(profile))
  .catch(error => next(createError(404, error.message)));
});

profileRouter.delete('/api/profile/:id', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/profile/:id');

  Profile.findByIdAndRemove(request.params.id)
  .then(() => response.sendStatus(204))
  .catch(err => next(createError(404, err.message)));
});
