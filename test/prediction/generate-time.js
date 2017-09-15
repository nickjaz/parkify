const timeFromFloatHour = require('./timeFromFloatHour.js');

function generateTime() {
  let date = new Date();
  
  let floatHour = Math.floor(Math.random() * 24);
  let time = timeFromFloatHour(floatHour);

  date.setHours = time.hour;
  date.setMinutes = time.minutes;
  date.setSeconds = time.seconds;
  
  return date;
}

module.exports = generateTime;