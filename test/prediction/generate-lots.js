const Lot = require('../../model/lot.js');

function generateLots(context, places) {
  let lotPromises = [];

  for (let index = 0; index < places.length; index++) {
    let place = places[index];

    let lot = {
      name: place.name,
      address: place.vicinity || '',
      coordinates: [place.geometry.location.lng, place.geometry.location.lat],
      userID: context.host._id
    };

    let lotPromise = Lot.create(lot);

    lotPromises.push(lotPromise);
  }

  return Promise.all(lotPromises);
}

module.exports = generateLots;