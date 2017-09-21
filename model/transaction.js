'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = Schema({
  startTime: { type: Date },
  endTime: { type: Date },
  price: { type: Number },
  hostID: { type: Schema.Types.ObjectId, required: true },
  guestID: { type: Schema.Types.ObjectId, required: true },
  lotID: { type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('transaction', transactionSchema);