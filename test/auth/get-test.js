'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../../model/user.js');

require('../../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  name: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

describe('Auth Routes', function () {
  describe('GET: /api/signin', function () {
    describe('with a valid body', function () {
      before(done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleuser', '1234')
        .end((err, result) => {
          expect(result.status).to.equal(200);
          done();
        });
      });
    });
    
    describe('W/O auth', function () {
      before(done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });
    
    describe('W/O basic auth', function () {
      before(done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });
      after(done => {
        User.remove({})
          .then(() => done())
          .catch(done);
      });
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
          .set({
            Authorization: `${this.tempToken}`
          })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });
    });
    describe('no name in auth', function () {
      before(done => {
        let noNameUser = {
          name: 'gig',
          password: '1234',
          email: 'exampleuser@test.com'
        };
        let user = new User(noNameUser);
        user.generatePasswordHash(noNameUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });
      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      it('should return a token', done => {
        request.get(`${url}/api/signout`)
        .auth('exampleUser', '1234')
        .end((error, response) => {
          expect(response.status).to.equal(404);
          done();
        });
      });
    });
    describe('has name authorization but no password', function () {
      before(done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });
      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .set({
          Authorization: 'Basic name:'
        })
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });
  });
});