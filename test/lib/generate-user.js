'use strict';

const uuidv4 = require('uuid/v4');
const debug = require('debug')('parkify:generate-user');
const User = require('../../model/user.js');

let generateUser = function() {
  debug('generateUser');

  return new Promise((resolve, reject) => {
    const testUserData = {
      name: 'user-' + uuidv4(),
      password: uuidv4(),
      email: uuidv4() + '@test.com'
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