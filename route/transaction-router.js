'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:transaction-router');
const jsonParser = require('body-parser').json();
const transactionParser = require('../lib/transaction-parser.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Transaction = require('../model/transaction.js');

const transactionRouter = new Router();

transactionRouter.post('/api/transaction', bearerAuth, jsonParser, transactionParser, function(request, response) {
  debug('POST: /api/transaction');

  Transaction.create(request.body)
  .then(transaction => {
    response.set('Location', `/api/lot/${transaction._id}`);
    response.sendStatus(201);
  });
});

transactionRouter.get('/api/transaction/:id', bearerAuth, function(request, response, next) {
  debug('GET: /api/transaction/:id');

  Transaction.findById(request.params.id)
  .then(transaction => {    
    if (!transaction.hostID.equals(request.user._id) && !transaction.guestID.equals(request.user._id)) {
      let error = createError(401, 'Not authorized to access this transaction.');
      return next(error);
    }

    response.json(transaction);
  })
  .catch(error => {
    error = createError(404, error.message);
    next(error);
  });
});

module.exports = transactionRouter;