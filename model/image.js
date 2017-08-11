'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
  lotID: { type: Schema.Types.ObjectId, required: true },
  imageURI: { type: String, required: true, unique: true },
  objectKey: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('image', imageSchema);
