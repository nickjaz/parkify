'use strict';

const debug = require('debug')('parkify:generate-spot');
const Timeslot = require('../../model/timeslot.js');

let generateTimeslot = function(spotID) {
  debug('generateTimeslot');

  let testTimeslotData = {
    endTime: Date.now(),
    startTime: Date.now(),
    spotID: spotID
  };

  return Timeslot.create(testTimeslotData);
};

module.exports = generateTimeslot;