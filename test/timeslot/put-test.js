'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');
const Spot = require('../../model/spot.js');
const Timeslot = require('../../model/timeslot.js');

const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');
const generateSpot = require('../lib/generate-spot.js');
const generateTimeslot = require('../lib/generate-timeslot');

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
    })
    .then( () => generateSpot(this.lot._id))
    .then( tempSpot => {
      this.spot = tempSpot;
    })
    .then( () => generateTimeslot(this.spot._id))
    .then( tempTimeslot => {
      this.timeslot = tempTimeslot;
      this.updatedTimeslot = {
        startTime: Date('017-09-14T12:00:00.000Z'),
        endTime: Date('017-09-14T01:00:00.000Z')
      };
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
    it('should return a 200', done => {
      request.put(`${url}/api/lot/${this.lot._id}/spot/${this.spot._id}/timeslot/${this.timeslot._id}`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .send(this.updatedTimeslot)
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).equal(200);
        expect(Date.parse(response.body.endTime)).equal(Date.parse(this.updatedTimeslot.endTime));
        expect(Date.parse(response.body.startTime)).equal(Date.parse(this.updatedTimeslot.startTime));
        done();
      });
    });
  });

  describe('Unauthorized Request', () => {
    it('should return a 401', done => {
      request.put(`${url}/api/lot/${this.lot._id}/spot/${this.spot._id}/timeslot/${this.timeslot._id}`)
      .set({
        Authorization: ''
      })
      .send(this.updatedTimeslot)
      .end((error, response) => {
        expect(response.status).equal(401);
        done();
      });
    });
  });

  describe('Invalid Id', () => {
    it('should return a 404', done => {
      request.put(`${url}/api/lot/${this.lot._id}/spot/${this.spot._id}/timeslot/123456`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .send(this.updatedTimeslot)
      .end((error, response) => {
        expect(response.status).equal(404);
        done();
      });
    });
  });

  describe('Invalid Body', () => {
    it('should return a 400', done => {
      request.put(`${url}/api/lot/${this.lot._id}/spot/${this.spot._id}/timeslot/${this.timeslot._id}`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .send('')
      .end((error, response) => {
        expect(response.status).equal(400);
        done();
      });
    });
  });
});