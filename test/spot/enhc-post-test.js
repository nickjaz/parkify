'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');
const Spot = require('../../model/spot.js');

const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');
// const generateSpot = require('../lib/generate-spot.js');

const url = `http://localhost:${process.env.PORT}`;

require('../../server.js');

describe('PUT: /api/car/:id', function() {
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
        done();
      });
    });
  });
});