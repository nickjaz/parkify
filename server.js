'use strict';

const express = require('express');
const debug = require('debug')('parkify:server');
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`listening on: ${PORT}`);
});
