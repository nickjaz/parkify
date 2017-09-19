const timeFromFloatHour = require('./time-from-float-hour.js');

function generateTime() {
  let date = new Date();
  
  let floatHour = Math.floor(Math.random() * 24);
  let time = timeFromFloatHour(floatHour);

  console.log('date1:', date);
  date.setHours(time.hour);
  console.log('date2:', date);
  date.setMinutes(time.minutes);
  console.log('date3:', date);
  date.setSeconds(time.seconds);
  console.log('date4:', date);
  
  return date;
}

module.exports = generateTime;