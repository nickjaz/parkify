'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../../../model/user.js');
const Lot = require('../../../model/lot.js');
const Spot = require('../../../model/spot.js');
const Timeslot = require('../../../model/timeslot.js');

const generateUser = require('../../generators/generate-user.js');
const generateLot = require('../../generators/generate-lot.js');
const generateSpot = require('../../generators/generate-spot.js');
const generateTimeslot = require('../../generators/generate-timeslot');

const url = `http://localhost:${process.env.PORT}`;

require('../../../server.js');

describe('Timeslot DELETE: /api/lot/:lotID/spot/:spotID/timeslot/:id', function() {
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
    .then( () => generateSpot(this.lot._id))
    .then( tempSpot => {
      this.spot = tempSpot;
    })
    .then( () => generateTimeslot(this.spot._id))
    .then( tempTimeslot => {
      this.timeslot = tempTimeslot;
      done();
    })
    .catch(done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Lot.remove({}),
      Spot.remove({}),
      Timeslot.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('Valid Request', () => {
    it('should return a 204 status code', done => {
      request.delete(`${url}/api/lot/${this.lot._id}/spot/${this.spot._id}/timeslot/${this.timeslot._id}`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).equal(204);
        done();
      });
    });
  });

  describe('Unregistered Id', () => {
    it('should return a 404 status code', done => {
      request.delete(`${url}/api/lot/${this.lot._id}/spot/${this.spot._id}/timeslot/123456`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .end((error, response) => {
        expect(response.status).equal(404);
        done();
      });
    });
  });

  describe('Invalid Token', () => {
    it('should return a 401 status code', done => {
      request.delete(`${url}/api/lot/${this.lot._id}/spot/${this.spot._id}/timeslot/${this.timeslot._id}`)
      .end((error, response) => {
        expect(response.status).equal(401);
        done();
      });
    });
  });
});