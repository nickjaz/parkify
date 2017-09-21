'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../../../model/user.js');
const Car = require('../../../model/car.js');
const generateUser = require('../../generators/generate-user.js');

const url = `http://localhost:${process.env.PORT}`;

require('../../../server.js');

describe('POST: /api/car', function() {
  beforeEach( done => {
    generateUser()
    .then( data => {
      this.user = data.user;
      this.userToken = data.token;
      this.testCarData = {
        make: 'Subaru',
        model: 'Outback',
        color: 'Evergreen',
        licensePlate: 'PNW-123',
        userID: data.user._id
      };
      done();
    })
    .catch(done);
  });
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Car.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('Valid Request Body and Valid Token', () => {
    it('should return a 200', done => {
      request.post(`${url}/api/car`)
      .set({ Authorization: `Bearer ${this.userToken}` })
      .send(this.testCarData)
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).equal(200);
        expect(response.body.make).equal(this.testCarData.make);
        expect(response.body.model).equal(this.testCarData.model);
        expect(response.body.color).equal(this.testCarData.color);
        expect(response.body.licensePlate).equal(this.testCarData.licensePlate);
        expect(response.body.userID).equal(this.testCarData.userID.toString());
        done();
      });
    });
  });

  describe('Invalid Token', () => {
    it('should return a 401', done => {
      request.post(`${url}/api/car`)
      .set({
        Authorization: ''
      })
      .send(this.testCarData)
      .end((error, response) => {
        expect(response.status).equal(401);
        expect(error.name).equal('Error');
        expect(error.message).equal('Unauthorized');
        done();
      });
    });
  });

  describe('Invalid Body', () => {
    it('should return a 400', done => {
      request.post(`${url}/api/car`)
      .set({ Authorization: `Bearer ${this.userToken}` })
      .send()
      .end((error, response) => {
        expect(response.status).equal(400);
        expect(error.name).equal('Error');
        expect(error.message).equal('Bad Request');
        done();
      });
    });
  });
});
