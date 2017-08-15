'use strict';

const createError = require('http-errors');
const debug = require('debug')('parkify:transaction-parser.js');
const Spot = require('../model/spot.js');
const User = require('../model/user.js');

module.exports = function(request, resolve, next) {
  debug('Transaction parser middleware.');
  
  User.findById(request.body.hostID)
  .then(user => {
    request.body.hostID = user._id;
    return Promise.resolve();
  })
  .then(() => {
    return User.findById(request.body.guestID);
  })
  .then(user => {
    request.body.guestID = user._id;
    return Promise.resolve();
  })
  .then(() => {
    return Spot.findById(request.body.spotID);
  })
  .then(spot => {
    request.body.spotID = spot._id;
    next();
  })
  .catch(error => {
    error = createError(400, error.message);
    next(error);
  });
};