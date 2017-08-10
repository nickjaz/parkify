'use strict';

 const Router = require('express').Router;
 const jsonParser = require('body-parser').json();
 const debug = require('debug')('parkify:lot-router');

 const Lot = require('../model/lot.js');
 const bearerAuth = require('../lib/bearer-auth-middleware.js');

 const lotRouter = module.exports = Router();

 lotRouter.post('/api/lot', bearerAuth, jsonParser function(request, response, next) {
   debug('POST: /api/band')
 })
