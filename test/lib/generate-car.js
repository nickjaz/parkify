'use strict';

const debug = require('debug')('parkify:generate-car');
const Car = require('../../model/car.js');

let generateCar = function(userID) {
  debug('generateCar');

  let testCarData = {
    make: 'Subaru',
    model: 'Outback',
    color: 'Evergreen',
    licensePlate: 'PNW-123',
    userID: userID
  };

  return Car.create(testCarData);
};


