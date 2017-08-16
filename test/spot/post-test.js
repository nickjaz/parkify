'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');
const Spot = require('../../model/spot.js');

const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');

const url = `http://localhost:${process.env.PORT}`;

require('../../server.js');

describe('ENHC POST: ${url}/api/lot/${this.lot._id}/spot', function() {
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

      this.spot = {
        name: 'example spot',
        description: 'example spot description',
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
      Spot.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('Valid Request', () => {
    it('should return a 201 status code', done => {
      request.post(`${url}/api/lot/${this.lot._id}/spot`)
      .send(this.spot)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).equal(201);
        expect(response.body.name).equal(this.spot.name);
        expect(response.body.description).equal(this.spot.description);
        expect(response.body.lotID.toString()).equal(this.lot._id.toString());
        done();
      });
    });
  });

  describe('Unauthorized Request', () => {
    it('should return 401 status code', done => {
      request.post(`${url}/api/lot/${this.lot._id}/spot`)
      .send(this.spot)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
    });
  });

  describe('Invalid Data', () => {
    it('should return 400 status code', done => {
      request.post(`${url}/api/lot/${this.lot._id}/spot`)
      .send({})
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });
  });
});