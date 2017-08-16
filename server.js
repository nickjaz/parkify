'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const debug = require('debug')('parkify:server');
const authRouter = require('./route/auth-router.js');
const carRouter = require('./route/car-router.js');
const feedbackRouter = require('./route/feedback-router.js');
const lotRouter = require('./route/lot-router.js');
const spotRouter = require('./route/spot-router.js');
const timeslotRouter = require('./route/timeslot-router.js');
const transactionRouter = require('./route/transaction-router.js');
const errorHandler = require('./lib/error-handler.js');

dotenv.load();

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(authRouter);
app.use(carRouter);
app.use(feedbackRouter);
app.use(lotRouter);
app.use(spotRouter);
app.use(timeslotRouter);
app.use(transactionRouter);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  debug(`listening on: ${process.env.PORT}`);
});
