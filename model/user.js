'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const Promise = require('bluebird');
const debug = require('debug')('parkify:user');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let User;

const userSchema = Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tokenHash: { type: String, unique: true }
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('generatePasswordHash');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function (password) {
  debug('comparePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'invalid password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateTokenHash = function () {
  debug('generateTokenHash');

  return new Promise((resolve, reject) => {
    let tries = 0;

    _generateTokenHash.call(this);

    function _generateTokenHash() {
      this.tokenHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => {
        resolve(this.tokenHash);
      })
      .catch(err => {
        if (tries > 3) return reject(err);
        tries++;
        _generateTokenHash.call(this);
      });
    }
  });
};

userSchema.methods.generateToken = function () {
  debug('generateToken');

  return new Promise((resolve, reject) => {
    this.generateTokenHash()
    .then(tokenHash => {
      resolve(jwt.sign({ token: tokenHash }, process.env.APP_SECRET));
    })
    .catch(err => reject(err));
  });
};

userSchema.methods.generateHostTokenHash = function () {
  debug('generateHostTokenHash');

  return new Promise((resolve, reject) => {
    let tries = 0;

    _generateTokenHash.call(this);

    function _generateTokenHash() {
      this.tokenHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then(() => {
        resolve(this.tokenHash);
      })
      .catch(err => {
        if (tries > 3) return reject(err);
        tries++;
        _generateTokenHash.call(this);
      });
    }
  });
};

userSchema.methods.generateHostToken = function () {
  debug('generateHostToken');

  return new Promise((resolve, reject) => {
    this.generateTokenHash()
    .then(tokenHash => {
      resolve(jwt.sign({ token: tokenHash }, process.env.APP_SECRET));
    })
    .catch(err => reject(err));
  });
};

userSchema.statics.createAuthenticated = function(userData, callback) {
  debug('createAuthenticated');
  new User(userData).generatePasswordHash(userData.password)
  .then(user => user.save())
  .then(user => {
    user.generateToken()
    .then(token => {
      callback(null, user, token);
      return Promise.resolve();
    })
    .catch(error => {
      callback(error);
      return Promise.resolve();
    });
  })
  .catch(callback);
};

module.exports = User = mongoose.model('user', userSchema);
