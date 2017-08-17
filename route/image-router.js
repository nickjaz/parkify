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
const dataDir = `${__dirname}/../data`;
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
    del([`${dataDir}/*`]);

    let imageData = {
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      userID: request.user._id,
      lotID: request.params.lotID
    };

    return Image.create(imageData);
  })
  .then( image => response.json(image))
  .catch(error => next(error));
});

imageRouter.get('/api/lot/:lotID/image/:id', bearerAuth, function(request, response, next) {
  debug('GET: /api/lot/:lotID/image/:id');

  Image.findById(request.params.id)
  .then( image => {
    if (!image) return next(createError(404, 'Image Not Found'));
    response.json(image);
  })
  .catch(error => next(createError(404, error.message)));
});

imageRouter.delete('/api/lot/:id/image/:id', bearerAuth, function(request, response, next) {
  debug('DELETE: /api/lot/:lotID/image/:id');

  Image.findById(request.params.id)
  .then( image => {
    let params = {
      Bucket: process.env.AWS_BUCKET,
      Key: image.objectKey
    };

    s3.deleteObject(params, error => {
      if (error) {
        return next(error);
      }
      
      response.sendStatus(204);
    });
  })
  .catch(error => next(createError(404, error.message)));
});
