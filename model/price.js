'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  price: { type: String, required: true},
  lotID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('price', priceSchema);
