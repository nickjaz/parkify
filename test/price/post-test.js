'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');
const Price = require('../../model/price.js');

const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');

const url = `http://localhost:${process.env.PORT}`;

require('../../server.js');

describe('Price Override POST Route', function() {
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

      this.price = {
        startTime: Date('017-09-14T12:00:00.000Z'),
        endTime: Date('017-09-14T03:00:00.000Z'),
        price: '8',
        lotID: this.lot._id
      };

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
    it('should return a 201 status code', done => {
      request.post(`${url}/api/lot/${this.lot._id}/price`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .send(this.price)
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).equal(201);
        expect(Date.parse(response.body.startTime)).equal(Date.parse(this.price.startTime));
        expect(Date.parse(response.body.endTime)).equal(Date.parse(this.price.endTime));
        expect(response.body.lotID.toString()).equal(this.lot._id.toString());
        done();
      });
    });
  });

  describe('Unauthorized Request', () => {
    it('should return a 401 status code', done => {
      request.post(`${url}/api/lot/${this.lot._id}/price`)
      .send(this.price)
      .end((error, response) => {
        expect(response.status).equal(401);
        done();
      });
    });
  });

  describe('Invalid Data', () => {
    it('should return a 400 status code', done => {
      request.post(`${url}/api/lot/${this.lot._id}/price`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .send()
      .end((error, response) => {
        expect(response.status).equal(400);
        done();
      });
    });
  });
});
