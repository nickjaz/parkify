'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const User = require('../../../model/user.js');
const Lot = require('../../../model/lot.js');

require('../../../server.js');

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

describe('Lot Put Route', function() {
  describe('PUT: /api/lot/:id', function() {
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

    before( done => {
      exampleLot.userID = this.tempUser._id.toString();
      new Lot(exampleLot).save()
      .then( lot => {
        this.tempLot = lot;
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

    describe('valid request', () => {
      it('should return 200 and updated property values', done => {
        request.put(`${url}/api/lot/${this.tempLot._id}`)
        .send({ name: 'new lot name' })
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          if(error) return done(error);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal('new lot name');
          done();
        });
      });
    });

    describe('nonexsistent id', () => {
      it('should return 404 status code', done => {
        request.put(`${url}/api/lot/1234567890`)
        .send({ name: 'new lot name' })
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
        request.put(`${url}/api/lot/${this.tempLot._id}`)
        .send({ name: 'new lot name'})
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });

    describe('invalid data', () => {
      it('should return 400 status code', done => {
        request.put(`${url}/api/lot/${this.tempLot._id}`)
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
