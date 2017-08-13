'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const User = require('../../model/user.js');
const Car = require('../../model/car.js');
const generateUser = require('../lib/generate-user.js');
const generateCar = require('../lib/generate-car.js');

const url = `http://localhost:${process.env.PORT}`;


describe('Car Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Car.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/car', function() {
    beforeEach( done => {
      let user = new User(exampleUser);

      user.generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    it('200: should POST test car', done => {
      request.post()
    })
  })
})
