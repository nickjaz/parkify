'use strict';

const NodeGeocoder = require('node-geocoder');
const debug = require('debug')('parkify:geocoder.js');

const geocoderOptions = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GOOGLE_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(geocoderOptions);

module.exports = function(request, response, next) {
  debug('geocoder middleware');
  if (!request.body.address) {
    next();
    return;
  }

  geocoder.geocode(request.body.address)
  .then(function(response) {
    console.log(response);
    request.body.coordinates = [response[0].longitude, response[0].latitude];
  })
  .catch(function(error) {
    console.log(error);
  });
};