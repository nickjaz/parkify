'use strict';

const request = require('superagent');
const generateUser = require('./generate-user.js');
const generateLot = require('./generate-lot.js');
const generateSpot = require('./generate-spot.js');
const generateTransaction = require('./generate-transaction.js');
// const NodeGeocoder = require('node-geocoder');

let generateLotTransactions = function(sampleCount, startDate, endDate, address, distanceRadius = 500) {
  return new Promise(function(resolve, reject) {
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
    .then(() => generateLot(context.host._id))
    .then(lot => {
      context.lot = lot;
    })
    .then(() => generateSpot(context.lot._id))
    .then(spot => {
      context.spot = spot;
    })
    .then(() => getNearbyPlaces(address, distanceRadius))
    // .then(() => Promise.all(generateTransactionData(sampleCount, startDate, endDate, address, distanceRadius)))    
    // .then(transactions => {
    //   resolve(transactions);
    // })
    .catch(error => reject(error));
  });
};

// function generateTransactionData(sampleCount, startDate, endDate, address, distanceRadius) {
  
//   const transactions = [];

//   for (let transactionNumber = 0; transactionNumber < sampleCount; transactionNumber++) {
    
//   }

// }

function getNearbyPlaces(address, distanceRadius) {
  request.get('https://maps.googleapis.com/maps/api/place/textsearch/json')
  .query(`query=${encodeURIComponent(address)}`)
  .query(`radius=${distanceRadius}`)
  .query(`key=${process.env.GOOGLE_API_KEY}`)
  .end(function(error, response) {
    console.log(response);
  });

}

module.exports = generateLotTransactions;