const Spot = require('../../model/spot.js');

function generateSpots(context, lots) {
  context.lots = lots;
  let spotPromises = [];

  for (let lotIndex = 0; lotIndex < lots.length; lotIndex++) {
    let lot = lots[lotIndex];
    let spotsCount = Math.floor(Math.random() * 30);

    for (let spotNumber = 1; spotNumber <= spotsCount; spotNumber++) {
      let spot = {
        name: `Spot ${spotNumber}`,
        lotID: lot._id
      };

      let spotPromise = Spot.create(spot);

      spotPromises.push(spotPromise);
    }
  }

  return Promise.all(spotPromises);
}

module.exports = generateSpots;