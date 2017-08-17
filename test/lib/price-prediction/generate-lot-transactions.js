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
    .then(lots => createSpots(context, lots))
    .then(spots => generateTransactions(context, spots))
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
  context.lots = lots;
  let spots = [];

  for (let lotIndex = 0; lotIndex < lots.length; lotIndex++) {
    let lot = lots[lotIndex];
    let spotsCount = Math.floor(Math.random() * 30);

    for (let spotNumber = 1; spotNumber <= spotsCount; spotNumber++) {
      spots.push(Spot.create({
        name: `Spot ${spotNumber}`,
        lotID: lot._id
      }));
    }
  }

  return Promise.all(spots);
}

function generateTransactions(context, spots) {
  for (let spotIndex = 0; spotIndex < spots.length; spotIndex++) {
    let spot = spots[spotIndex];
    generateFeatures(spot);
    calculateModeledPrice(spot);
    console.log('---------------------');
    console.log(spotIndex);
    console.log(spot.features);
    console.log('Price: ' + spot.price);
  }
}

function generateFeatures(spot) {
  spot.features = {
    hoursFromEvent: Math.random(),
    hourOfDay: Math.random(),
    landmarkProximity: Math.random(),
    cityCenterProximity: Math.random(),
    cityPopulation: Math.random()
  };
}

// price,    time of day (x/24), eventProximity (0-1), landmarkProximity (0-1), cityCenterProximity (0-1), cityPopulation (% of max)  

function calculateModeledPrice(spot) {
  let features = spot.features;

  console.log('hoursFromEvent:', calculateEventPriceModifier(features.hoursFromEvent));
  console.log('hourOfDay:', calculateTimePriceModifier(features.hourOfDay));
  console.log('landmarkProximity:', calculateLandmarkPriceModifier(features.landmarkProximity));
  console.log('cityCenterProximity:', calculateCityCenterPriceModifier(features.cityCenterProximity));
  console.log('cityPopulation:', calculatePopulationDensityPriceModifier(features.cityPopulation));

  spot.price = 1
  + calculateEventPriceModifier(features.hoursFromEvent) 
  + calculateTimePriceModifier(features.hourOfDay) 
  + calculateLandmarkPriceModifier(features.landmarkProximity)
  + calculateCityCenterPriceModifier(features.cityCenterProximity)
  + calculatePopulationDensityPriceModifier(features.cityPopulation);
}

function calculateEventPriceModifier(hoursFromEvent) {
  return 2 / (4 * Math.pow(hoursFromEvent, 2) + 1);
}

function calculateTimePriceModifier(hourOfDay) {
  let hourOfDay24 = hourOfDay * 24;
  
  if (hourOfDay24 > 11 - Math.sqrt(11) && hourOfDay24 < 11 + Math.sqrt(11)) {
    console.log('hour:',hourOfDay24,'distance from 11:', Math.pow(11 - hourOfDay24, 2)); 
    return 5 - Math.min(0, Math.max(2, Math.pow(11 - hourOfDay24, 2)));
  }

  if (hourOfDay24 > 21 - Math.sqrt(21) && hourOfDay24 < 21 + Math.sqrt(21)) {
    return 5 - Math.min(0, Math.max(2, Math.pow(21 - hourOfDay24, 2)));
  }

  return 0;
}

function calculateLandmarkPriceModifier(landmarkProximity) {
  if (landmarkProximity < Math.PI / 5) {
    return 0.5 * Math.sin(landmarkProximity * 5 - Math.PI / 2) + 0.5;
  }

  return 0;
}

function calculateCityCenterPriceModifier(cityCenterProximity) {
  if (cityCenterProximity < Math.PI / 5) {
    return 0.5 * Math.sin(cityCenterProximity * 5 - Math.PI / 2) + 0.5;
  }

  return 0;
}


function calculatePopulationDensityPriceModifier(populationDensity) {
  if (populationDensity < Math.PI / 5) {
    return 0.5 * Math.sin(populationDensity * 5 - Math.PI / 2) + 0.5;
  }

  return 0;
}

module.exports = generateLotTransactions;