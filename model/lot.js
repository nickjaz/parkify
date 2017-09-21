'use strict';

const mongoose = require('mongoose');
const debug = require('debug');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Spot = require('./spot.js');
const Price = require('./price.js');

const lotSchema = Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true, unique: true },
  coordinates: { type: Array, required: true, unique: true },
  prices: [{ type: Schema.Types.ObjectId, ref: 'price' }],
  userID: { type: Schema.Types.ObjectId, required: true },
  spots: [{ type: Schema.Types.ObjectId, ref: 'spot' }]
});

const Lot = module.exports = mongoose.model('lot', lotSchema);

Lot.findByIdAndAddSpot = function(id, spot) {
  debug('findByIdAndAddSpot');

  return Lot.findById(id)
  .catch(error => Promise.reject(createError(404, error.message)))
  .then( lot => {
    spot.lotID = lot._id;
    this.tempLot = lot;
    return new Spot(spot).save();
  })
  .then( spot => {
    this.tempLot.spots.push(spot._id);
    this.tempSpot = spot;
    return this.tempLot.save();
  })
  .then( () => {
    return this.tempSpot;
  });
};

Lot.findByIdAndAddPrice = function(id, price) {
  debug('findByIdAndAddPrice');

  return Lot.findById(id)
  .catch( error => Promise.reject(createError(404, error.message)))
  .then( lot => {
    price.lotID = lot._id;
    this.tempLot = lot;
    return Price.create(price);
  })
  .then( price => {
    this.tempLot.prices.push(price._id);
    this.tempPrice = price;
    return this.tempLot.save();
  })
  .then( () => {
    return this.tempPrice;
  });
};
