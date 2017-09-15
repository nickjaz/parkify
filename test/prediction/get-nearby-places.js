const https = require('https');
const querystring = require('querystring');

function getNearbyPlaces(latitude, longitude, distanceRadius, type) {
  return new Promise((resolve, reject) => {
    const query = {
      location: `${latitude},${longitude}`,
      type: type,
      radius: distanceRadius,
      key: process.env.GOOGLE_KEY
    };

    const options = {
      hostname: 'maps.googleapis.com',
      port: 443,
      path: `/maps/api/place/nearbysearch/json?${querystring.stringify(query)}`,
      method: 'GET'
    };

    let body = '';

    let request = https.request(options, response => {
      response.on('data', data => {
        body += data.toString();
      });

      response.on('end', () => {
        body = JSON.parse(body);
        resolve(body.results);
      });
    });
    
    request.on('error', error => {
      reject(error);
    });

    request.end();
  });
}

module.export = getNearbyPlaces;