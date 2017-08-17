'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const Image = require('../../model/image.js');
const User = require('../../model/user.js');
const Lot = require('../../model/lot.js');

require('../../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  name: 'exampleuser',
  password: '12345',
  email: 'example@test.com'
};

const exampleLot = {
  name: 'example lot name',
  description: 'example lot description',
  address: 'example address'
};

const exampleImage = {
  image: `${__dirname}/../../data/test.png`
};

describe('Image Post Route', function() {

  describe('POST: /api/lot/:lotID/image', function() {
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
        Lot.remove({}),
        Image.remove({})
      ])
      .then( () => done())
      .catch(done);
    });

    describe('valid request', () => {

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
