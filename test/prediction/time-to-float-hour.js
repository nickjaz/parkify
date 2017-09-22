'use strict';

function timeToFloatHour(date) {
  if (!(date instanceof Date)) { 
    throw new Error('Expected parameter \'date\' to be of type \'Date\'');
  }

  return date.getHours() + (date.getMinutes() / 60) + (date.getSeconds() / 3600);
}

module.exports = timeToFloatHour;