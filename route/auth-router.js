'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('parkify:auth-router');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');
const superagent = require('superagent');

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
    response.cookie('X-Parkify-Token', token, {maxAge:900000});
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

authRouter.get('/oauth/google/code*', (request, response) => {
  if (!request.query.code) {
    response.redirect(process.env.CLIENT_URL);
  } else {
    superagent.post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: request.query.code,
      grant_type: 'authorization_code',
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.API_URL}/oauth/google/code`
    })
    .then(response => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
      .set('Authorization', `Bearer ${response.body.access_token}`);
    })
    .then(response => {
      return User.handleOAuth(response.body);
    })
    .then(user => {
      return user.generateToken();
    })
    .then(token => {
      response.cookie('X-Parkify-Token', token);
      response.redirect(process.env.CLIENT_URL);
      response.send(token);
    })
    .catch((error) => {
      console.error(error);
      response.redirect(process.env.CLIENT_URL);
    });
  }
});