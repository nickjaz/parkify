'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const Spot = require('../../model/spot.js');
const Lot = require('../../model/lot.js');
const User = require('../../model/user.js');
const Timeslot = require('../../model/timeslot.js');

require('../../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  name: 'exampleuser',
  password: '12345',
  email: 'example@test.com'
};

const exampleLot = {
  name: 'example lot',
  description: 'example lot description',
  address: 'example address',
};

const exampleSpot = {
  name: 'example spot',
  description: 'example spot description',
};

const exampleTimeslot = {
  startTime: Date.now,
  endTime: Date.now
};

describe('Timeslot Post Route', function() {
  describe('POST: /api/lot/:lotID/spot', function() {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => {
        return user.save();
      })
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
      })
      .then( () => {
        exampleLot.userID = this.tempUser._id.toString();
        new Lot(exampleLot).save()
        .then( lot => {
          this.tempLot = lot;
        })
        .then( () => {
          exampleSpot.lotID = this.tempLot._id.toString();
          new Spot(exampleSpot).save()
          .then( spot => {
            this.tempSpot = spot;
            done();
          })
          .catch(done);
        });

        after( done => {
          Promise.all([
            User.remove({}),
            Lot.remove({}),
            Spot.remove({}),
            Timeslot.remove({})
          ])
          .then( () => done())
          .catch(done);
        });

        describe('valid request', () => {
          it('should return 201 status and expected property values', done => {
            request.post(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}/timeslot`)
            .send(exampleTimeslot)
            .set({
              Authorization: `Bearer ${this.tempToken}`
            })
            .end((error, response) => {
              if (error) return done(error);
              expect(response.status).to.equal(201);
              expect(response.body.startTime).to.equal(exampleLot.startTime);
              expect(response.body.endTime).to.equal(exampleLot.endTime);
              expect(response.body.spotID).to.equal(this.tempSpot._id.toString());
              done();
            });
          });
        });

        describe('unauthorized request', () => {
          it('should return 401 status code', done => {
            request.post(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}/timeslot`)
            .send(exampleLot)
            .end((error, response) => {
              expect(response.status).to.equal(401);
              done();
            });
          });
        });

        describe('invalid data', () => {
          it('should return 400 status code', done => {
            request.post(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}/timeslot`)
            .send({ startTime: 'fake time' })
            .end((error, response) => {
              expect(response.status).to.equal(400);
              done();
            });
          });
        });
      });
    });
  });
});
