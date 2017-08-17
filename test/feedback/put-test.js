'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const Feedback = require('../../model/feedback.js');
const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');

const generateFeedback = require('../lib/generate-feedback.js');
const generateUser = require('../lib/generate-user.js');
const generateLot = require('../lib/generate-lot.js');

require('../../server.js');
const url = `http://localhost:${process.env.PORT}`;

describe('Feedback Put Route', function() {
  describe('PUT: /api/feedback/:id', function() {
    before(done => {
      generateUser()
      .then(data => {
        this.host = data.user;
        this.hostToken = data.token;
      })
      .then(() => generateLot(this.host._id))
      .then(lot => {
        this.lot = lot;
      })
      .then(() => generateUser())
      .then(data => {
        this.guest = data.user;
      })
      .then(() => generateFeedback(this.guest._id, this.lot._id))
      .then(feedback => {
        this.feedback = feedback;
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
      it('should return 200 and updated property values', done => {
        request.put(`${url}/api/feedback/${this.feedback._id}`)
        .send({ title: 'new feedback title' })
        .set({ Authorization: `Bearer ${this.hostToken}` })
        .end((error, response) => {
          if(error) return done(error);
          expect(response.status).to.equal(200);
          expect(response.body.title).to.equal('new feedback title');
          done();
        });
      });
    });

    describe('unauthorized request', () => {
      it('should return 401 status code', done => {
        request.put(`${url}/api/feedback/${this.feedback._id}`)
        .send({ name: 'new feedback title'})
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });

    describe('nonexistent id', () => {
      it('should return 404 status code', done => {
        request.put(`${url}/api/feedback/1234567890`)
        .send({ name: 'new feedback title' })
        .set({ Authorization: `Bearer ${this.hostToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          done();
        });
      });
    });

    describe('invalid data', () => {
      it('should return 400 status code', done => {
        request.put(`${url}/api/feedback/${this.feedback._id}`)
        .set({ Authorization: `Bearer ${this.hostToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          done();
        });
      });
    });
  });
});
