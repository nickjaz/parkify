'use strict';

const https = require('https');
const generateUser = require('../generate-user.js');
const Lot = require('../../../model/lot.js');
const Spot = require('../../../model/spot.js');

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
    .then(() => getNearbyPlaces())
    .then(places => createLots(context, places))
    .then(lots => {
      context.lots = lots;
      return createSpots(context, lots);
    })
    .catch(error => reject(error));
  });
};

function getNearbyPlaces(latitude = '47.6182513', longitude = '-122.35406', distanceRadius = 500, type = 'parking') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'maps.googleapis.com',
      port: 443,
      path: `/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=${type}&radius=${distanceRadius}&key=${process.env.GOOGLE_KEY}`,
      method: 'GET'
    };

    let body = '';

    let request = https.request(options, response => {
      response.on('data', data => {
        body += data.toString();
      });

      response.on('end', () => {
        body = JSON.parse(body);
        resolve(body.results);
      });
    });
    
    request.on('error', error => {
      reject(error);
    });

    request.end();
  });
}

function createLots(context, places) {
  let lots = [];

  for (let index = 0; index < places.length; index++) {
    let place = places[index];
    
    lots.push(Lot.create({
      name: place.name,
      address: `${place.geometry.location.lat},${place.geometry.location.lng}`,
      userID: context.host._id
    }));
  }

  return Promise.all(lots);
}

function createSpots(context, lots) {
  let spots = [];

  for (let lotIndex = 0; lotIndex < lots.length; lotIndex++) {
    let lot = lots[lotIndex];
    let spotsCount = Math.floor(Math.rand() * 30);

    for (let spotNumber = 1; spotNumber <= spotsCount; spotNumber++) {
      spots.push(Spot.create({
        name: `Spot ${spotNumber}`,
        lotID: lot._id
      }));
    }
  }

  return Promise.all(spots);
}

module.exports = generateLotTransactions;