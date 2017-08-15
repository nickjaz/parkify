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

describe('Spot Post Route', function() {
  describe('POST: /api/lot/:lotID/spot', function() {
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
      it('should return 201 status and expected property values', done => {
        request.post(`${url}/api/lot/${this.tempLot._id}/spot`)
        .send(exampleSpot)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          if (error) return done(error);
          expect(response.status).to.equal(201);
          expect(response.body.name).to.equal(exampleSpot.name);
          expect(response.body.description).to.equal(exampleSpot.description);
          expect(response.body.lotID).to.equal(this.tempLot._id.toString());
          done();
        });
      });
    });

    describe('unauthorized request', () => {
      it('should return 401 status code', done => {
        request.post(`${url}/api/lot/${this.tempLot._id}/spot`)
        .send(exampleSpot)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });

    describe('invalid data', () => {
      it('should return 400 status code', done => {
        request.post(`${url}/api/lot/${this.tempLot._id}/spot`)
        .send({})
        .end((error, response) => {
          expect(response.status).to.equal(400);
          done();
        });
      });
    });
  });
});
