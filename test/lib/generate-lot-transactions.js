'use strict';

const generateUser = require('./generate-user.js');
const generateLot = require('./generate-lot.js');
const generateSpot = require('./generate-spot.js');
const generateTransaction = require('./generate-user.js');
const NodeGeocoder = require('node-geocoder');

let generateLotTransactions = function(sampleCount, startDate, endDate, address, distanceRadius=500) {
  return new Promise((resolve, reject) => {

    const placeQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=47.6182,122.3519&radius=${distanceRadius}&key=${process.env.GOOGLE_API_KEY}`;
    

    generateUser()
    .then(data => {
      this.host = data.user;
      this.hostToken = data.token;
    })
    .then(() => generateUser())
    .then(data => {
      this.guest = data.user;
      this.guestToken = data.token;
    })
    .then(() => generateLot(this.host._id))
    .then(lot => {
      this.lot = lot;
    })
    .then(() => generateSpot(this.lot._id))
    .then(spot => {
      this.spot = spot;
    })
    .then(() => Promise.all(generateTransactionData(sampleCount, startDate, endDate, address, distanceRadius)))    
    .then(transactions => {
      resolve(transactions);
    })
    .catch(error => reject(error));
  });
};

function generateTransactionData(sampleCount, startDate, endDate, address, distanceRadius) {
  for (let transactionNumber = 0; transactionNumber < sampleCount; transactionNumber++) {
    
  }

}

module.exports = generateLotTransactions;