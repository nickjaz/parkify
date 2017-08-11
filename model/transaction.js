'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  hostID: { type: Schema.Types.ObjectId, required: true },
  guestID: { type: Schema.Types.ObjectId, required: true },
  spotID: { type: Schema.Types.ObjectId, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('transaction', transactionSchema);