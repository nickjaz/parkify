'use strict';

const mongoose = require('mongoose');
const debug = require('debug'('parkify:price'));
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Spot = require('./spot.js');

const priceSchema = Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  price: { type: String, required: true},
  LotID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('price', priceSchema);
