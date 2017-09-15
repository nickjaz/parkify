function generatePrice(startTime, endTime, spot) {
  return price(toFloatHour(endTime)) - price(toFloatHour(startTime))  + (2 * Math.rand() - 1); 
}

function toFloatHour(time) {
  return time.getSeconds() / 360 + time.getMinutes() / 60 + time.getHours();
}

function price(floatHour) {
  return 2 * floatHour - (6 / Math.PI) * Math.cos((Math.PI / 24) * floatHour) - (72 / Math.PI) * Math.cos((Math.PI / 8) * floatHour);
}

module.exports = generatePrice;