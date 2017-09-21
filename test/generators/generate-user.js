'use strict';

const debug = require('debug')('parkify:generate-user');
const User = require('../../model/user.js');
const faker = require('faker');

let generateUser = function() {
  debug('generateUser');

  return new Promise((resolve, reject) => {
    const testUserData = {
      name: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    };

    User.createAuthenticated(testUserData, (error, user, token) => {
      if (error) {
        return reject(error);
      }

      resolve({ user: user, token: token });
    });
  });
};

module.exports = generateUser;