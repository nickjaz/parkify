'use strict';

const debug = require('debug')('parkify:generate-price');
const Price = require('../../model/price.js');

let generatePrice = function(lotId) {
  debug('generatePrice');

  let testPriceData = {
    startTime: Date('017-09-14T12:00:00.000Z'),
    endTime: Date('017-09-14T03:00:00.000Z'),
    price: '8',
    lotID: lotId
  };

  return Price.create(testPriceData);
};

module.exports = generatePrice;