'use strict';

const debug = require('debug')('parkify:generate-feedback');
const Feedback = require('../../model/feedback.js');

let generateFeedback = function(userID, lotID) {
  debug('generateFeedback');

  let testFeedbackData = {
    title: 'feedback',
    content: 'test content',
    userID: userID,
    time: Date.now(),
    rating: 5,
    lotID: lotID
  };

  return Feedback.create(testFeedbackData);
};

module.exports = generateFeedback;
