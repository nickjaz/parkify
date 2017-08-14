'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const Spot = require('../../model/spot.js');
const Lot = require('../../model/lot.js');
const User = require('../../model/user.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`

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

describe('Spot Post Route', function() {
  describe('DELETE: /api/lot/:lotID/spot/:spotID', function() {
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
