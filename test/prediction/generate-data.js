'use strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.load();

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

const debug = require('debug')('parkify:generate-data');
const generateUser = require('../generators/generate-user.js');
const getNearbyPlaces = require('./get-nearby-places.js');
const generateLots = require('./generate-lots.js');
const generateSpots = require('./generate-spots.js');
const generateTransactions = require('./generate-transactions.js');

let generateData = function() {
  return new Promise(function(resolve, reject) {
    debug('generateData');
    let context = {};
    generateUser()
    .then(data => {
      context.host = data.user;
      context.hostToken = data.token;
    })
    .then(() => generateUser())
    .then(data => {
      context.guest = data.user;
      context.guestToken = data.token;
    })
    .then(() => getNearbyPlaces('47.6182513', '-122.35406', 500, 'parking'))
    .then(places => generateLots(context, places))
    .then(lots => generateSpots(context, lots))
    .then(spots => generateTransactions(context, spots))
    .catch(error => reject(error));
  });
};

generateData()
.then(() => {
  mongoose.disconnect();
});