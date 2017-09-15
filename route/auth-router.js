'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('parkify:auth-router');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');

const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(request, response, next) {
  debug('POST: /api/signup');

  let password = request.body.password;
  delete request.body.password;

  let user = new User(request.body);

  user.generatePasswordHash(password)
  .then( user => user.save())
  .then( user => user.generateToken())
  .then( token => {
    response.token('Parkify-Token', token, {maxAge:900000});
    response.send(token);
  })
  .catch(next);
});

authRouter.get('/api/signin', basicAuth, function(request, response, next) {
  debug('GET: /api/signin');

  User.findOne({ name: request.auth.name })
  .then( user => user.comparePasswordHash(request.auth.password))
  .then( token => response.send(token))
  .catch(next);
});
