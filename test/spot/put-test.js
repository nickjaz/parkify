'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');

const Spot = require('../../model/spot.js');
const Lot = require('../../model/lot.js');
const User = require('../../model/user.js');

require('../../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleSpot = {
  name: 'example spot',
  description: 'example spot description',
};

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
        request.put(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}`)
        .send({ name: 'new spot name'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
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
        request.put(`${url}/api/lot/${this.tempLot._id}/spot/1234567890`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          done();
        });
      });
    });

    describe('unauthorized request', () => {
      it('should return 401 status code', done => {
        request.put(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}`)
        .send(exampleSpot)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });

    describe('invalid data', () => {
      it('should return 400 status code', done => {
        request.put(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          done();
        });
      });
    });
  });
});
