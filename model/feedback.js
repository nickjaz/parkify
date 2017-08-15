'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userID: { type: Schema.Types.ObjectId, required: true },
  time: { type: Date, required: true, default: Date.now },
  rating: { type: Number, min: 1, max: 5 },
  lotID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('feedback', feedbackSchema);
