'use strict';

const mongoose =   require('mongoose');
const debug = require('debug');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Timeslot = require('./timeslot.js');

const spotSchema = Schema({
  name: { type: String, required: true },
  description: { type: String },
  timeslots: [{ type: Schema.Types.ObjectId, ref: 'timeslot' }],
  lotID: { type: Schema.Types.ObjectId, required: true }
});

const Spot = module.exports = mongoose.model('spot', spotSchema);

Spot.findByIdAndAddTimeslot = function(id, timeslot) {
  debug('findByIdAndAddSpot');

  return Spot.findById(id)
  .catch(error => Promise.reject(createError(404, error.message)))
  .then( spot => {
    timeslot.spotID = spot._id;
    this.tempSpot = spot;
    return new Timeslot(timeslot).save();
  })
  .then( timeslot => {
    this.tempSpot.timeslots.push(timeslot._id);
    this.tempTimeslot = timeslot;
    return this.tempSpot.save();
  })
  .then( () => {
    return this.tempTimeslot;
  });
};
