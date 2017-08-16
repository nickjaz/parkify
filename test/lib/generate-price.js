'use strict';

const debug = require('debug')('parkify:generate-price');
const Price = require('../../model/price.js');

let generatePrice = function(lotId) {
  debug('generatePrice');

  let testPriceData = {
    start: Date(),
    end:,
    price:,
    lotID: lotId
  };

  return Price.create(testLotData);
};

module.exports = generatePrice;