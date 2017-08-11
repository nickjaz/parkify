'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeslotSchema = Schema({
  time: { type: Date, required: true },
  taken: { type: Boolean, required: true }
});

module.exports = mongoose.model('timeslot', timeslotSchema);
