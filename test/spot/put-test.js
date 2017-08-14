// 'use strict';
//
// const expect = require('chai').expect;
// const request = require('superagent');
// const Promise = require('bluebird');
//
// const Spot = require('../../model/spot.js');
// const Lot = require('../../model/lot.js');
// const User = require('../../model/user.js');
//
// require('../../server.js');
//
// const url = `http://localhost:${process.env.PORT}`;
//
// const exampleUser = {
//   name: 'exampleuser',
//   password: '12345',
//   email: 'example@test.com'
// };
//
// const exampleLot = {
//   name: 'example lot',
//   description: 'example lot description',
//   address: 'example address',
// };
//
// const exampleSpot = {
//   name: 'example spot',
//   description: 'example spot description',
// };
//
// describe('Spot Put Route', function() {
//   describe('PUT: /api/lot/:lotID/spot/:spotID', function() {
//     before( done => {
//       new User(exampleUser)
//       .generatePasswordHash(exampleUser.password)
//       .then( user => {
//         return user.save();
//       })
//       .then( user => {
//         this.tempUser = user;
//         return user.generateToken();
//       })
//       .then( token => {
//         this.tempToken = token;
//       })
//       .then( () => {
//         exampleLot.userID = this.tempUser._id.toString();
//         new Lot(exampleLot).save()
//         .then( lot => {
//           this.tempLot = lot;
//           done();
//         })
//         .catch(done);
//       });
//
//       before( done => {
//         new Spot(exampleSpot).save()
//         .then( spot => {
//           this.tempSpot = spot;
//           done();
//         })
//         .catch(done);
//       });
//
//       after( done => {
//         Promise.all([
//           User.remove({}),
//           Lot.remove({}),
//           Spot.remove({})
//         ])
//         .then( () => done())
//         .catch(done);
//       });
//
//       describe('valid request', () => {
//         it('should return 200 status and correct property values', done => {
//           request.put(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}`)
//           .send({ name: 'new spot name'})
//           .set({
//             Authorization: `Bearer ${this.tempToken}`
//           })
//           .end((error, response) => {
//             if (error) return done(error);
//             expect(response.status).to.equal(200);
//             expect(response.body.name).to.equal('new spot name');
//             done();
//           });
//         });
//       });
//
//       describe('nonexistent id', () => {
//         it('should return a 404 status code', done => {
//           request.put(`${url}/api/lot/${this.tempLot._id}/spot/1234567890`)
//           .set({
//             Authorization: `Bearer ${this.tempToken}`
//           })
//           .end((error, response) => {
//             expect(response.status).to.equal(404);
//             done();
//           });
//         });
//       });
//
//       describe('unauthorized request', () => {
//         it('should return 401 status code', done => {
//           request.put(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}`)
//           .send(exampleSpot)
//           .end((error, response) => {
//             expect(response.status).to.equal(401);
//             done();
//           });
//         });
//       });
//
//       describe('invalid data', () => {
//         it('should return 400 status code', done => {
//           request.put(`${url}/api/lot/${this.tempLot._id}/spot/${this.tempSpot._id}`)
//           .set({
//             Authorization: `Bearer ${this.tempToken}`
//           })
//           .end((error, response) => {
//             expect(response.status).to.equal(400);
//             done();
//           });
//         });
//       });
//     });
//   });
// });
