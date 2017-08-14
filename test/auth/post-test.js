// 'use strict';
//
// const expect = require('chai').expect;
// const request = require('superagent');
// const User = require('../../model/user.js');
//
// require('../../server.js');
//
// const url = `http://localhost:${process.env.PORT}`;
//
// const exampleUser = {
//   name: 'exampleuser',
//   password: '1234',
//   email: 'exampleuser@test.com'
// };
//
// describe('Auth Routes', function () {
//   describe('POST: /api/signup', function () {
//     describe('with a valid body', function () {
//       after(done => {
//         User.remove({})
//         .then(() => done())
//         .catch(done);
//       });
//
//       it('should return a token', done => {
//         request.post(`${url}/api/signup`)
//         .send(exampleUser)
//         .end((error, response) => {
//           if (error) return done(error);
//           expect(response.status).to.equal(200);
//           expect(response.text).to.be.a('string');
//           done();
//         });
//       });
//     });
//   });
// });