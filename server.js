'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const debug = require('debug')('parkify:server');

const carRouter = require('./route/car-router.js');

const app = express();
const PORT = process.env.PORT || 3000;
const transactionRouter = require('./route/transaction-router.js');
const errorHandler = require('./lib/error-handler.js');

app.use(cors());
app.use(morgan('dev'));
app.use(transactionRouter);
app.use(errorHandler);

app.use(carRouter);

app.listen(PORT, () => {
  debug(`listening on: ${PORT}`);
});
