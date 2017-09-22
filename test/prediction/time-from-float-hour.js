'use strict';

function timeFromFloatHour(floatHour) {
  if (!(floatHour instanceof Number)) { 
    throw new Error('Expected parameter \'floatHour\' to be of type \'Number\'');
  }

  let hourInt = Math.floor(floatHour);
  let minute = floatHour - hourInt;
  let minuteInt = Math.floor(minute * 60);
  let second = minute - minuteInt;
  let secondInt = Math.floor(second * 60);

  return { 
    hour: hourInt, 
    minute: minuteInt, 
    second: secondInt
  }; 
}

module.exports = timeFromFloatHour;