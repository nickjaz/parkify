'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const Feedback = require('../../model/feedback.js');
const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');

const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');

require('../../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleFeedback = {
  title: 'example feedback',
  content: 'example content',
  time: Date.now(),
  rating: 5
};

describe('POST: /api/feedback', function() {
  before(done => {
    generateUser()
    .then(data => {
      this.host = data.user;
      this.hostToken = data.token;
    })
    .then(() => generateLot(this.host._id))
    .then(lot => {
      this.lot = lot;
      exampleFeedback.lotID = this.lot._id;
      done();
    })
    .catch(done);
  });

  before(done => {
    generateUser()
    .then(data => {
      this.guest = data.user;
      exampleFeedback.userID = data.user._id;
      done();
    })
    .catch(done);
  });

  after(done => {
    Promise.all([
      User.remove({}),
      Lot.remove({}),
      Feedback.remove({})
    ])
    .then(() => done())
    .catch(done);
  });

  describe('valid request', () => {
    it('should return 200 status code and expected property values', done => {
      request.post(`${url}/api/feedback`)
      .set({ Authorization: `Bearer ${this.hostToken}` })
      .send(exampleFeedback)
      .end((error, response) => {
        if(error) return done(error);
        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal('example feedback');
        expect(response.body.content).to.equal('example content');
        console.log('*****userID:', response.body.userID, 'example userID:', exampleFeedback.userID, 'example lotID:', exampleFeedback.lotID);
        expect(response.body.userID).to.equal(exampleFeedback.userID.toString());
        expect(response.body.rating).to.equal(5);
        expect(response.body.lotID).to.equal(exampleFeedback.lotID.toString());
        done();
      });
    });
  });

  describe('unauthorized request', () => {
    it('should return 401 status code', done => {
      request.post(`${url}/api/feedback`)
      .send(exampleFeedback)
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
    });
  });

  describe('invalid data', () => {
    it('should return 400 status code', done => {
      request.post(`${url}/api/feedback`)
      .send({})
      .set({ Authorization: `Bearer ${this.hostToken}`})
      .end((error, response) => {
        expect(response.status).to.equal(400);
        done();
      });
    });
  });
});
