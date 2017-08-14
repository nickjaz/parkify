// 'use strict';
//
// const expect = require('chai').expect;
// const request = require('superagent');
// const Promise = require('bluebird');
//
// const User = require('../../model/user.js');
// const Lot = require('../../model/lot.js');
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
//   name: 'example name',
//   description: 'example description',
//   address: 'example address'
// };
//
// describe('Lot Get Route', function() {
//   describe('GET: /api/lot/:id', function() {
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
//         done();
//       })
//       .catch(done);
//     });
//
//     before( done => {
//       exampleLot.userID = this.tempUser._id.toString();
//       new Lot(exampleLot).save()
//       .then( lot => {
//         this.tempLot = lot;
//         done();
//       })
//       .catch(done);
//     });
//
//     after( done => {
//       Promise.all([
//         User.remove({}),
//         Lot.remove({})
//       ])
//       .then( () => done())
//       .catch(done);
//     });
//
//     describe('valid reuqest', () => {
//       it('should return 200 and correct property values', done => {
//         request.get(`${url}/api/lot/${this.tempLot._id}`)
//         .set({
//           Authorization: `Bearer ${this.tempToken}`
//         })
//         .end((error, response) => {
//           if(error) return(error);
//           expect(response.status).to.equal(200);
//           expect(response.body.name).to.equal(exampleLot.name);
//           expect(response.body.description).to.equal(exampleLot.description);
//           expect(response.body.address).to.equal(exampleLot.address);
//           expect(response.body.userID).to.equal(this.tempUser._id.toString());
//           done();
//         });
//       });
//     });
//
//     describe('nonexsistent id', () => {
//       it('should return a 404 status code', done => {
//         request.get(`${url}/api/lot/1234567890`)
//         .set({
//           Authorization: `Bearer ${this.tempToken}`
//         })
//         .end((error, response) => {
//           expect(response.status).to.equal(404);
//           done();
//         });
//       });
//     });
//
//     describe('unauthorized request', () => {
//       it('should return a 401 status code', done => {
//         request.get(`${url}/api/lot/${this.tempLot._id}`)
//         .end((error, response) => {
//           expect(response.status).to.equal(401);
//           done();
//         });
//       });
//     });
//   });
// });
