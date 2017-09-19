let {cos, PI} = Math;

function generatePrice(startTime, endTime) {
  let startTimeFloat = toFloatHour(startTime);
  let endTimeFloat = toFloatHour(endTime);

  console.log(startTime);
  console.log(endTime);

  return price(endTimeFloat) - price(startTimeFloat) + (2 * Math.random() - 1); 
}

function toFloatHour(time) {
  return (time.getSeconds() / 360 + time.getMinutes() / 60 + time.getHours());
}

function price(x) {
  return ((2 * x) - (72 / PI) * cos((PI / 24) * x) - (6 / PI) * cos((PI / 8) * x));
}

module.exports = generatePrice;