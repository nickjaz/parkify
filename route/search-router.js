const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:spot-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

const Lot = require('../model/lot.js');
const searchRouter = module.exports = Router();

searchRouter.get('/api/search', bearerAuth, function(request, response, next) {
  debug('GET: /api/search');

  var area = {};

  if (request.query.radius) {
    area.radius = request.query;
  }

  Lot.find().circle('coordinates', area)
  .then(lots => {
    response.json(lots);
  })
  .catch(err => next(createError(404, err.message)));
});