'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  price: { type: String, required: true},
  lotID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('price', priceSchema);
