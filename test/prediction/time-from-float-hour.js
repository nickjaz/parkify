function timeFromFloatHour(floatHour) {
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