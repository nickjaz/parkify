'use strict';

const express = require('express');
const debug = require('debug')('parkify:server');

const carRouter = require('./route/car-router.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(carRouter);

app.listen(PORT, () => {
  debug(`listening on: ${PORT}`);
});
