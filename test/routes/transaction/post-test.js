'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const User = require('../../../model/user.js');
const Lot = require('../../../model/lot.js');
const Spot = require('../../../model/spot.js');
const Transaction = require('../../../model/transaction.js');
const generateUser = require('../../generators/generate-user.js');
const generateSpot = require('../../generators/generate-spot.js');
const generateLot = require('../../generators/generate-lot.js');
const url = `http://localhost:${process.env.PORT}`;

require('../../../server.js');

describe('POST: /api/transaction', function() {
  before(done => {
    generateUser()
    .then(data => {
      this.host = data.user;
      this.hostToken = data.token;
    })
    .then(() => generateUser())
    .then(data => {
      this.guest = data.user;
      this.guestToken = data.token;
    })
    .then(() => generateLot(this.host._id))
    .then(lot => {
      this.lot = lot;
    })
    .then(() => generateSpot(this.lot._id))
    .then(spot => {
      this.spot = spot;
      this.testTransactionData = {
        startTime: Date.now(),
        endTime: Date.now(),
        price: 1000000,
        hostID: this.host._id,
        guestID: this.guest._id,
        spotID: this.spot._id
      };
      done();
    })
    .catch(done);
  });

  after(done => {
    Promise.all([
      User.remove({}),
      Lot.remove({}),
      Spot.remove({}),
      Transaction.remove({})
    ])
    .then(() => done())
    .catch(done);
  });

  describe('Valid Request', () => {
    it('should return a 201 status code and a location header.', done => {


      request.post(`${url}/api/transaction`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .send(this.testTransactionData)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.get('Location')).to.be.a('string');
        done();
      });
    });
  });

  describe('Unauthorized Request', () => {
    it('should return a 401 status code.', done => {
      request.post(`${url}/api/transaction`)
      .send(this.testTransactionData)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
    });
  });

  describe('Invalid Data', () => {
    it('should return a 400 status code.', done => {
      request.post(`${url}/api/transaction`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .send()
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });
  });
});