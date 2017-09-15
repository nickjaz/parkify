'use strict';

const debug = require('debug')('parkify:generate-lot');
const Lot = require('../../model/lot.js');

let generateLot = function(userID) {
  debug('generateLot');

  let testLotData = {
    name: 'parking lot',
    description: 'test description',
    address: '1 Codefellows Way, Seattle, WA',
    userID: userID
  };

  return Lot.create(testLotData);
};

module.exports = generateLot;