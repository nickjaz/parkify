'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const generateUser = require('../generators/generate-user.js');
const url = `http://localhost:${process.env.PORT}`;

require('../../server.js');

describe('Nonexistent Route', function() {
  before(done => {
    generateUser()
    .then(data => {
      this.user = data.user;
      this.token = data.token;
      done();
    })
    .catch(done);
  });

  it('should return a 404 status code.', done => {
    request.get(`${url}/api/ponies`)
    .set({
      Authorization: `Bearer ${this.token}`
    })
    .end((error, response) => {
      expect(response.status).to.equal(404);
      done();
    });
  });
});