'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Promise = require('bluebird');

const Feedback = require('../../../model/feedback.js');
const User = require('../../../model/user.js');
const Lot = require('../../../model/lot.js');

const generateFeedback = require('../../generators/generate-feedback.js');
const generateUser = require('../../generators/generate-user.js');
const generateLot = require('../../generators/generate-lot.js');

require('../../../server.js');
const url = `http://localhost:${process.env.PORT}`;

describe('Feedback Delete Route', function() {
  describe('DELETE: /api/feedback/:id', function() {
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
      it('should return 204 status code', done => {
        request.delete(`${url}/api/feedback/${this.feedback._id}`)
        .set({ Authorization: `Bearer ${this.hostToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(204);
          done();
        });
      });
    });

    describe('nonexistent id', () => {
      it('should return 404 status code', done => {
        request.delete(`${url}/api/feedback/1234567890`)
        .set({ Authorization: `Bearer ${this.hostToken}` })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          done();
        });
      });
    });

    describe('unauthorized id', () => {
      it('should return 401 status code', done => {
        request.delete(`${url}/api/feedback/${this.feedback._id}`)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });
  });
});
