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
  startTime: Date.now(),
  endTime: Date.now()
};

describe('Timeslot Delete Route', function() {
  describe('DELETE: /api/lot/:lotID/spot/:spotID/timeslot/:id', function () {
    before(done => {
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
      .catch(done);
    });

    before(done => {
      exampleLot.userID = this.tempUser._id.toString();
      Lot.create(exampleLot)
      .then(lot => {
        this.tempLot = lot;
        done();
      })
      .catch(done);
    });

    before(done => {
      exampleSpot.userID = this.tempLot._id.toString();
      Lot.create(exampleSpot)
      .then(spot => {
        this.tempSpot = spot;
        done();
      })
      .catch(done);
    });
    
    before(done => {
      Timeslot.create(exampleTimeslot)
      .then(timeSlot => {
        this.tempTimeslot = timeslot;
        done();
      })
      .catch(done);
    });
    
    after(done => {
      Promise.all([
        User.remove({}),
        Lot.remove({}),
        Spot.remove({}),
      ])
      .then(() => done())
      .catch(done);
    });
    
    describe('valid request', () => {
      it('should return 204 status code', done => {
        request.delete(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}/timeslot/${this.tempTimeslot._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          if (error) return done(error);
          expect(response.status).to.equal(204);
          done();
        });
      });
    });
  });
  
  describe('nonexistent id', () => {
    it('should return a 404 status code', done => {
      request.delete(`${url}/api/lot/${this.tempLot._id}/timeslot/1234567890`)
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
      request.delete(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}/timeslot/${this.tempTimeslot._id}}`)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
    });
  });
});
