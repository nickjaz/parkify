'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('parkify:lot-router');

const Lot = require('../model/lot.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const lotRouter = module.exports = Router();

lotRouter.post('/api/lot', bearerAuth, jsonParser, function(request, response, next) {
  debug('POST: /api/band');

  if (Object.keys(request.body).length === 0) return next(createError(400, 'Bad Request'));

  request.body.userID = request.user._id;

  new Lot(request.body).save()
  .then( lot => response.json(lot))
  .catch(next);
});
