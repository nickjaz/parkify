'use strict';

let moment = require('moment');
let toFloatHour = require('./time-to-float-hour');

let {sin, PI} = Math;

function generatePrice(startTime, endTime) {

  let duration = moment.duration(endTime - startTime).asHours();
  let startTimeFloat = toFloatHour(startTime);

  let endPrice = price(startTimeFloat + duration);
  let startPrice = price(startTimeFloat);

  return twoDecimals(endPrice - startPrice); 
}

function price(x) {
  return -9 * (sin(PI * x / 6) + 2 * sin(PI * x / 12)) / PI + 4 * x;
}

function twoDecimals(x) {
  return Math.round(x * 100) / 100;
}

module.exports = generatePrice;