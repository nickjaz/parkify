'use strict';

const debug = require('debug')('parkify:generate-transaction');
const Transaction = require('../../model/transaction.js');

let generateTransaction = function(hostID, guestID, spotID) {
  debug('generateTransaction');

  let testTransactionData = {
    startTime: Date.now(),
    endTime: Date.now(),
    price: 1000000,
    hostID: hostID, 
    guestID: guestID,
    spotID: spotID 
  };

  return Transaction.create(testTransactionData);
};

module.exports = generateTransaction;