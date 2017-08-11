'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spotSchema = Schema({
  name: { type: String, required: true },
  description: { type: String },
  timeslots: [{ type: Schema.Types.ObjectId, ref: 'timeslot' }],
  lotID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('spot', spotSchema);
