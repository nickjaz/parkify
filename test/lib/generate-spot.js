'use strict';

const debug = require('debug')('parkify:generate-spot');
const Spot = require('../../model/spot.js');

let generateSpot = function(lotID) {
  debug('generateSpot');

  let testSpotData = { 
    name: 'parking spot',
    description: 'test description',
    lotID: lotID 
  };

  return Spot.create(testSpotData);
};

module.exports = generateSpot;