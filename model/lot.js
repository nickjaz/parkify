'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lotSchema = Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true, unique: true },
  userID: { type: Schema.Types.ObjectId, required: true },
  hostID: { type: Schema.Types.ObjectId, required: true },
  spots: [{ type: Schema.Types.ObjectId, ref: 'spot' }],
  //not sure if we need spots taken property
  spotsTaken: { type: Number, required: true }
});

module.exports = mongoose.model('lot', lotSchema);
