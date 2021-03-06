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
const imageRouter = require('./route/image-router.js');
const spotRouter = require('./route/spot-router.js');
const searchRouter = require('./route/search-router.js');
const priceRouter = require('./route/price-router.js');
const profileRouter = require('./route/profile-router.js');
const timeslotRouter = require('./route/timeslot-router.js');
const transactionRouter = require('./route/transaction-router.js');
const errorHandler = require('./lib/error-handler.js');

dotenv.load();

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true
});

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGINS,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(authRouter);
app.use(carRouter);
app.use(feedbackRouter);
app.use(lotRouter);
app.use(imageRouter);
app.use(spotRouter);
app.use(searchRouter);
app.use(priceRouter);
app.use(profileRouter);
app.use(timeslotRouter);
app.use(transactionRouter);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  debug(`listening on: ${process.env.PORT}`);
});
