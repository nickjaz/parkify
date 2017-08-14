'use strict';

const expect = require('chai').expect;
const request = require('superagent');
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
        });
      });
      
      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleuser', '1234')
        .end((error, response) => {
          expect(response.status).to.equal(200);
          done();
        });
      });
    });
  });
});