'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const Image = require('../../../model/image.js');
const User = require('../../../model/user.js');
const Lot = require('../../../model/lot.js');

require('../../../server.js');

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
  objectKey: 'exampleimage.png',
  imageURI: 'http://amazon-aws.com/exampleimage.png'
};

describe('Image Get Routes', function() {
  describe('GET: /api/lot/:lotID/image/:id', function() {
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
      exampleImage.lotID = this.tempLot._id.toString();
      exampleImage.userID = this.tempUser._id.toString();
      new Image(exampleImage).save()
      .then( image => {
        this.tempImage = image;
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
      it('should return 200 and correct property values', done => {
        request.get(`${url}/api/lot/${this.tempLot._id}/image/${this.tempImage._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((error, response) => {
          if(error) return done(error);
          expect(response.status).to.equal(200);
          expect(response.body.objectKey).to.equal(exampleImage.objectKey);
          expect(response.body.imageURI).to.equal(exampleImage.imageURI);
          done();
        });
      });
    });

    describe('unauthorized request', () => {
      it('should return 401 status code', done => {
        request.get(`${url}/api/lot/${this.tempLot._id}/image/${this.tempImage._id}`)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          done();
        });
      });
    });

    describe('nonexistent id', () => {
      it('should return 404 status code', done => {
        request.get(`${url}/api/lot/${this.tempLot._id}/image/1234567890`)
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
