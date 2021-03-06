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
const generateTransaction = require('../../generators/generate-transaction.js');
const url = `http://localhost:${process.env.PORT}`;

require('../../../server.js');

describe('GET: /api/transaction/:id', function() {
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
    .then(() => generateUser())
    .then(data => {
      this.uninvolvedGuest = data.user;
      this.uninvolvedGuestToken = data.token;
    })
    .then(() => generateLot(this.host._id))
    .then(lot => {
      this.lot = lot;
    })
    .then(() => generateSpot(this.lot._id))
    .then(spot => {
      this.spot = spot;
    })
    .then(() => generateTransaction(this.host._id, this.guest._id, this.spot._id))
    .then(transaction => {
      this.transaction = transaction;
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
    it('should return a 200 status code and correct property values.', done => {
      request.get(`${url}/api/transaction/${this.transaction._id}`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.startTime).to.equal(this.transaction.startTime.toJSON());
        expect(response.body.endTime).to.equal(this.transaction.endTime.toJSON());
        expect(response.body.price).to.equal(this.transaction.price);
        expect(response.body.hostID).to.equal(this.transaction.hostID.toString());
        expect(response.body.guestID).to.equal(this.transaction.guestID.toString());
        expect(response.body.spotID).to.equal(this.transaction.spotID.toString());
        done();
      });
    });
  });

  describe('Nonexistent Id', () => {
    it('should return a 404 status code.', done => {
      request.get(`${url}/api/transaction/123456789`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .end((error, response) => {
        expect(response.status).to.equal(404);
        done();
      });
    });
  });

  describe('Unauthorized Request', () => {
    it('should return a 401 status code with no authorization.', done => {
      request.get(`${url}/api/transaction/${this.transaction._id}`)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
    });

    it('should return a 401 status code with unauthorized credentials.', done => {
      request.get(`${url}/api/transaction/${this.transaction._id}`)
      .set({
        Authorization: `Bearer ${this.uninvolvedGuestToken}`
      })
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
    });
  });
});
