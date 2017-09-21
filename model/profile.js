'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  isHost: { type: Boolean, required: true, default: false },
  cars: [{ type: Schema.Types.ObjectId, ref: 'car' }],
  lots: [{ type: Schema.Types.ObjectId, ref: 'lot' }],
  transactions: [{ type: Schema.Types.ObjectId, ref: 'transaction' }],
  userID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('profile', profileSchema);
