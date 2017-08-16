'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const User = require('../model/user.js');
const Lot = require('../model/lot.js');
const Spot = require('../model/spot.js');
const Transaction = require('../model/transaction.js');
const generateLotTransactions = require('./lib/price-prediction/generate-lot-transactions.js');

require('../server.js');

describe('Lot Price Predictor', function() {
  before(done => {
    generateLotTransactions(100, Date.now(), Date.now(), '2901 3rd Ave #300, Seattle, WA 98121', 500)
    .then(done);
  });

  after(done => {
    Promise.all([
      User.remove({}),
      Lot.remove({}),
      Spot.remove({}),
      Transaction.remove({})
    ])
    .then(() => done());
  });

  describe('Valid Request', () => {
    it('should return places.', done => {
      done();
    });
  });
});