'use strict';

const expect = require('chai').expect;
const request = require('superagent');
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
  time: Date.now,
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
      exampleFeedback.userID = this.guest._id;
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
    it('should return 201 status code and expected property values', done => {
      request.post(`${url}/api/feedback`)
      .set({
        Authorization: `Bearer ${this.hostToken}`
      })
      .send(exampleFeedback)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('example feedback');
        expect(response.body.content).to.equal('example content');
        expect(response.body.userID).to.equal(this.guest._id.toString());
        expect(response.body.rating).to.equal(5);
        expect(response.body.lotID).to.equal(this.lot._id.toString());
        done();
      });
    });
  });
});
