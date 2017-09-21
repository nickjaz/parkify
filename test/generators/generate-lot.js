'use strict';

const debug = require('debug')('parkify:generate-lot');
const Lot = require('../../model/lot.js');

let generateLot = function(userID) {
  debug('generateLot');

  let testLotData = {
    name: 'parking lot',
    description: 'test description',
    address: '2901 3rd Ave #300, Seattle, WA 98121',
    coordinates: [-122.3518689, 47.6182499],
    userID: userID
  };

  return Lot.create(testLotData);
};

module.exports = generateLot;