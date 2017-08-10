'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  hostId: { type: Schema.Types.ObjectId, required: true },
  guestId: { type: Schema.Types.ObjectId, required: true },
  spotId: { type: Schema.Types.ObjectId, required: true },
  price: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('transaction', transactionSchema);