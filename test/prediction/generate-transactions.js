const Transaction = require('../../model/transaction.js');
const generateTime = require('./generate-time.js');
const generatePrice = require('./generate-price.js');

function generateTransactions(context, spots) {
  const transactionPromises = [];
  for (let spotIndex = 0; spotIndex < spots.length; spotIndex++) {
    let spot = spots[spotIndex];

    let time1 = generateTime();
    let time2 = generateTime();

    let startTime, endTime;

    if (time1 < time2) {
      startTime = time1;
      endTime = time2;
    } 
    else {
      startTime = time2;
      endTime = time1;
    }
    
    let price = generatePrice(startTime, endTime);

    let transaction = {
      startTime: startTime,
      endTime: endTime,
      price: price,
      hostID: context.host._id,
      guestID: context.guest._id,
      spotID: spot._id
    };

    let transactionPromise = Transaction.create(transaction);
    transactionPromises.push(transactionPromise);
  }

  return Promise.all(transactionPromises);
}

module.exports = generateTransactions;