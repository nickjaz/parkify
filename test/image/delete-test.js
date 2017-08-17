'use strict';

const expect = require('chai').expect;
const request = require('superagent');

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

describe('Image Delete Route', function() {

  describe('DELETE: /api/lot/:lotID/image/:id', function() {
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

    before( done => {
      request.post(`${url}/api/lot/${this.tempLot._id}/image`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .attach('image', exampleImage.image)
      .then( image => {
        this.tempImage = image.body;
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
      it('should return 204 status code', done => {
        request.delete(`${url}/api/lot/${this.tempLot._id}/image/${this.tempImage._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          if(error) return done(error);
          expect(response.status).to.equal(204);
          done();
        });
      });
    });

    describe('unauthorized request', () => {
      it('should return 401 status code', done => {
        request.delete(`${url}/api/lot/${this.tempLot._id}/image/${this.tempImage._id}`)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });

    describe('nonexistent id', () => {
      it('should return 404 status code', done => {
        request.delete(`${url}/api/lot/${this.tempLot._id}/image/1234567890`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          expect(response.status).to.equal(404);
          done();
        });
      });
    });
  });
});
