'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');

require('../../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  name: 'exampleuser',
  password: '12345',
  email: 'example@test.com'
};

const exampleLot = {
  name: 'example name',
  description: 'example description',
  address: 'example address'
};

describe('POST: /api/lot', function() {
  before( done => {
    new User(exampleUser)
    .generatePasswordHash(exampleUser.password)
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

  after( done => {
    Promise.all([
      User.remove({}),
      Lot.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('with a valid body', function() {
    it('should return a lot', done => {
      request.post(`${url}/api/lot`)
      .send(exampleLot)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((error, response) => {
        if(error) return done(error);
        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal(exampleLot.name);
        expect(response.body.description).to.equal(exampleLot.description);
        done();
      });
    });
  });
});
