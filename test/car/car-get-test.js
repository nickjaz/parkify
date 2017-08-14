'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../../model/user.js');
const Car = require('../../model/car.js');
const generateUser = require('../lib/generate-user.js');
const generateCar = require('../lib/generate-car.js');

const url = `http://localhost:${process.env.PORT}`;

require('../../server.js');

describe('GET: /api/car/:id', function() {
  beforeEach( done => {
    generateUser()
    .then( data => {
      this.user = data.user;
      this.userToken = data.token;
    })
    .then( () => generateCar(this.user._id))
    .then( data => {
      this.car = data;
      this.car.userID = data.userID;
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

  describe('Valid Car and Valid Token', () => {
    it('should return a 200', done => {
      request.get(`${url}/api/car/${this.car._id}`)
      .set({ Authorization: `Bearer ${this.userToken}` })
      .end((error, response) => {
        if (error) return done(error);
        expect(response.status).equal(200);
        expect(response.body.make).equal(this.car.make);
        expect(response.body.model).equal(this.car.model);
        expect(response.body.color).equal(this.car.color);
        expect(response.body.licensePlate).equal(this.car.licensePlate);
        expect(response.body.userID).equal(this.car.userID.toString());
        done();
      });
    });
  });

  describe('Invalid Token', () => {
    it('should return a 401', done => {
      request.get(`${url}/api/car/${this.car._id}`)
      .set({ Authorization: '' })
      .end((error, response) => {
        expect(response.status).equal(401);
        expect(error.name).equal('Error');
        expect(error.message).equal('Unauthorized');
        done();
      });
    });
  });

  describe('Invalid Car', () => {
    it('should return a 404', done => {
      request.get(`${url}/api/car/123456`)
      .set({ Authorization: `Bearer ${this.userToken}` })
      .end((error, response) => {
        expect(response.status).equal(404);
        expect(error.name).equal('Error');
        expect(error.message).equal('Not Found');
        done();
      });
    });
  });
});

