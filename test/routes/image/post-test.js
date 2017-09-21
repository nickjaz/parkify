'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const fs = require('fs');

const generateUser = require('../../generators/generate-user.js');
const generateLot = require('../../generators/generate-lot.js');
const Image = require('../../../model/image.js');
const User = require('../../../model/user.js');
const Lot = require('../../../model/lot.js');

require('../../../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleImage = {
  image: `${__dirname}/../../../data/test.png`
};

describe('Image Post Route', function() {

  describe('POST: /api/lot/:lotID/image', function() {
    before( done => {
      generateUser()
      .then(data => {
        this.tempUser = data.user;
        this.tempToken = data.token;
      })
      .then(() => generateLot(this.tempUser._id))
      .then(lot => {
        this.tempLot = lot;
        done();
      })
      .catch(done);
    });

    after( done => {
      Promise.all([
        User.remove({}),
        Lot.remove({}),
        Image.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

    describe('valid request', () => {
      before(done => {
        fs.link(`${__dirname}/../../data/test.png`, exampleImage.image, () => {
          done();
        });
      });

      it('should return 200 status code', done => {
        request.post(`${url}/api/lot/${this.tempLot._id}/image`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .attach('image', exampleImage.image)
        .end((error, response) => {
          if(error) return done(error);
          expect(response.status).to.equal(200);
          done();
        });
      });
    });

    describe('invalid data', () => {
      it('should return 400', done => {
        request.post(`${url}/api/lot/${this.tempLot._id}/image`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          expect(response.status).to.equal(400);
          done();
        });
      });
    });

    describe('unauthorized request', () => {
      before(done => {
        fs.link(`${__dirname}/../../data/test.png`, exampleImage.image, () => {
          done();
        });
      });

      after(done => {
        fs.unlink(`${__dirname}/../../../data/test.png`, () => {
          done();
        });
      });

      it('should return 401', done => {
        request.post(`${url}/api/lot/${this.tempLot._id}/image`)
        .attach('image', exampleImage.image)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });
  });
});
