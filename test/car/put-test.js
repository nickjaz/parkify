// 'use strict';
//
// const expect = require('chai').expect;
// const request = require('superagent');
//
// const User = require('../../model/user.js');
// const Car = require('../../model/car.js');
// const generateUser = require('../lib/generate-user.js');
// const generateCar = require('../lib/generate-car.js');
//
// const url = `http://localhost:${process.env.PORT}`;
//
// require('../../server.js');
//
// describe('GET: /api/car/:id', function() {
//   beforeEach( done => {
//     generateUser()
//     .then( data => {
//       this.user = data.user;
//       this.userToken = data.token;
//     })
//     .then( () => generateCar(this.user._id))
//     .then( data => {
//       this.car = data;
//       this.car.userID = data.userID;
//       this.updatedCar = {
//         make: 'Ferrari',
//         model: '458',
//         color: 'Neon Purple',
//       };
//       done();
//     })
//     .catch(done);
//   });
//
//   afterEach( done => {
//     Promise.all([
//       User.remove({}),
//       Car.remove({})
//     ])
//     .then( () => done())
//     .catch(done);
//   });
//
//   describe('Valid Request', () => {
//     it('should return a 200', done => {
//       request.put(`${url}/api/car/${this.car._id}`)
//       .set({
//         Authorization: `Bearer ${this.userToken}`
//       })
//       .send(this.updatedCar)
//       .end((error, response) => {
//         if (error) return done(error);
//         expect(response.status).equal(200);
//         expect(response.body.make).equal(this.updatedCar.make);
//         expect(response.body.model).equal(this.updatedCar.model);
//         expect(response.body.color).equal(this.updatedCar.color);
//         expect(response.body.licensePlate).equal(this.car.licensePlate);
//         done();
//       });
//     });
//   });
//
//   describe('Unauthorized Reqest', () => {
//     it('should return a 401', done => {
//       request.put(`${url}/api/car/${this.car._id}`)
//       .set({
//         Authorization: ''
//       })
//       .send(this.updatedCar)
//       .end((error, response) => {
//         expect(response.status).equal(401);
//         done();
//       });
//     });
//   });
//
//   describe('Nonexistent Id', () => {
//     it('should return a 404', done => {
//       request.put(`${url}/api/car/123456`)
//       .set({
//         Authorization: `Bearer ${this.userToken}`
//       })
//       .send(this.updatedCar)
//       .end((error, response) => {
//         expect(response.status).equal(404);
//         done();
//       });
//     });
//   });
// });
