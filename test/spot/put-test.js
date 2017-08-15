'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');
const generateSpot = require('../lib/generate-spot.js');

const Spot = require('../../model/spot.js');
const Lot = require('../../model/lot.js');
const User = require('../../model/user.js');

require('../../server.js');

const url = `http://localhost:${process.env.PORT}`;

describe('Spot Put Route', function() {
  describe('PUT: /api/lot/:lotID/spot/:spotID', function() {
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
        this.spot.lotID = tempSpot.lotID;
        done();
      })
      .catch(done);
    });

    after( done => {
      Promise.all([
        User.remove({}),
        Lot.remove({}),
        Spot.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

    describe('valid request', () => {
      it('should return 200 status and correct property values', done => {
        request.put(`${url}/api/lot/${this.spot.lotID}/spot/${this.spot._id}`)
        .send({ name: 'new spot name'})
        .set({
          Authorization: `Bearer ${this.hostToken}`
        })
        .end((error, response) => {
          if (error) return done(error);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal('new spot name');
          done();
        });
      });
    });

    describe('nonexistent id', () => {
      it('should return a 404 status code', done => {
        request.put(`${url}/api/lot/${this.spot.lotID}/spot/1234567890`)
        .set({
          Authorization: `Bearer ${this.hostToken}`
        })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          done();
        });
      });
    });

    describe('unauthorized request', () => {
      it('should return 401 status code', done => {
        request.put(`${url}/api/lot/${this.spot.lotID}/spot/${this.spot._id}`)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });

    describe('invalid data', () => {
      it('should return 400 status code', done => {
        request.put(`${url}/api/lot/${this.spot.lotID}/spot/${this.spot._id}`)
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
});
