const timeFromFloatHour = require('./time-from-float-hour.js');

function generateTime() {
  let date = new Date();
  let floatHour = Math.floor(Math.random() * 24);
  let time = timeFromFloatHour(floatHour);
  date.setHours(time.hour, time.minute, time.second, 0);
  return date;
}

module.exports = generateTime;