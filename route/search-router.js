const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:spot-router');

const bearerAuth = require('../lib/bearer-auth-middleware.js');

const Lot = require('../model/lot.js');
const searchRouter = module.exports = Router();

const NodeGeocoder = require('node-geocoder');

const geocoderOptions = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(geocoderOptions);

searchRouter.get('/api/search', bearerAuth, function(request, response, next) {
  debug('GET: /api/search');
  let address = request.query.query;
  geocoder.geocode(address)
  .then(function(addressData) {
    let center = [addressData[0].longitude, addressData[0].latitude];
    var area = {};
    
    area.radius = request.query.radius || 500;
    area.center = center;

    Lot.find().circle('coordinates', area)
    .then(lots => {
      response.send(lots);
    })
    .catch(err => next(createError(404, err.message)));
  })
  .catch(error => {
    next(error);
  });
});