'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeslotSchema = Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  spotID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('timeslot', timeslotSchema);
