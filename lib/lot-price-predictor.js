const createError = require('http-errors');
const debug = require('debug')('parkify:-lot-price-predictor.js');
const Transaction = require('../model/transaction.js');

let pricePredictor = {};

pricePredictor.predict = function(lotID, targetDate, dateOffset, distanceRadius) {
  return new Promise((resolve, reject) => {
    let lowerDateBound = new Date(targetDate.getTime());
    lowerDateBound.setDate(lowerBoundDate - dateOffset);
    let upperDateBound = new Date(targetDate.getTime());
    upperDateBound.setDate(upperBoundDate + dateOffset);
    Transaction.find({ 
      lotID: lotID, 
      startTime: { $gte: targetDate - dateOffset, $lte: targetDate + dateOffset },  
    })
    .then();
  });
};

// function aggreg