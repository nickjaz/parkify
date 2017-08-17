'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');
const Price = require('../../model/price.js');

const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');
const generatePrice = require('../lib/generate-price.js');

const url = `http://localhost:${process.env.PORT}`;

require('../../server.js');

describe('Price Override GET Route:', function() {
  beforeEach( done => {
    generateUser()
    .then( tempHost => {
      this.host = tempHost.user;
      this.hostToken = tempHost.token;
    })
    .then( () => generateLot(this.host._id))
    .then( tempLot => {
      this.lot = tempLot;
      this.lot.userID = tempLot.userID;
    })
    .then( () => generatePrice(this.lot._id))
    .then( tempPrice => {
      this.price = tempPrice;
      done();
    })
    .catch(done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Lot.remove({}),
      Price.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('Valid Request', () => {
    it('should return a 200 status code', done => {
      request.get(`${url}/api/lot/${this.lot._id}/price/${this.price._id}`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).equal(200);
        expect(Date.parse(response.body.startTime)).equal(Date.parse(this.price.startTime));
        expect(Date.parse(response.body.endTime)).equal(Date.parse(this.price.endTime));
        expect(response.body.lotID.toString()).equal(this.lot._id.toString());
        done();
      });
    });
  });

  describe('Unregistered Id', () => {
    it('should return a 404 status code', done => {
      request.get(`${url}/api/lot/${this.lot._id}/price/123456`)
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
    it('should return 401 status code', done => {
      request.get(`${url}/api/lot/${this.lot._id}/price/${this.price._id}`)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
    });
  });
});
