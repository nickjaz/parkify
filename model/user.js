'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const Promise = require('bluebird');
const debug = require('debug')('parkify:user');

const Schema = mongoose.Schema;

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
}

userSchema.methods.comparePasswordHash = function (password) {
  debug('comparePasswordHash');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'invalid password'));
      resolve(this);
    });
  });
}
//generated a 32hexideicmal string (token)
userSchema.methods.generateTokenHash = function () {
  debug('generateTokenHash');

  return new Promise((resolve, reject) => {
    let tries = 0;

    _generateTokenHash.call(this);

    function _generateTokenHash() {
      this.tokenHash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then(() => resolve(this.tokenHash))
        .catch(err => {
          if (tries > 3) return reject(err);
          tries++;
          _generateTokenHash.call(this);
        });
    }
  });
}
//two factor auth
userSchema.methods.generateToken = function () {
  debug('generateToken');

  return new Promise((resolve, reject) => {
    this.generateTokenHash()
      .then(tokenHash => resolve(jwt.sign({ token: tokenHash }, process.env.APP_SECRET)))
      .catch(err => reject(err));
  });
}

module.exports = mongoose.model('user', userSchema);
