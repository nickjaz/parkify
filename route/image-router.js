'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('parkify:image-router');

const Image = require('../model/image.js');
const Lot = require('../model/lot.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../../data`;
const upload = multer({ dest: dataDir });

const imageRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (error, s3data) => {
      if (error) reject(error);
      resolve(s3data);
    });
  });
}

imageRouter.post('/api/lot/:lotID/image', bearerAuth, upload.single('image'), function(request, response, next) {
  debug('POST: /api/lot/:lotID/image');

  if (!request.file) {
    return next(createError(400, 'file not found'));
  }

  if (!request.file.path) {
    return next(createError(500, 'file not saved'));
  }

  let ext = path.extname(request.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${request.file.filename}${ext}`,
    Body: fs.createReadStream(request.file.path)
  };

  Lot.findById(request.params.lotID)
  .then( () => s3uploadProm(params))
  .then( s3data => {
    del[`${dataDir}/*`];

    let imageData = {
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      userID: request.user._id,
      lotID: request.params.lotID
    };
    return new Image(imageData).save();
  })
  .then( image => {
    response.set('Location', `api/lot/:lotID/image/${image._id}`);
    response.sendStatus(201);
  })
  .catch(error => next(error));
});
