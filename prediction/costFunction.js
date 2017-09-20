let math = require('mathjs');
let sigmoid = require('./sigmoid.js');

module.exports = function(X, y, theta) {
  let m = y.length;
  let h = sigmoid(math.multiply(X, theta));
  let yt = math.transpose(y);
  let nyt = math.multiply(-1, yt);
  let nytlh = math.multiply(nyt, math.log(h));
  let omyt = math.subtract(1, yt);
  let omh = math.subtract(1, h);
  let lomh = math.log(omh);
  let omytlomh = math.multiply(omyt, lomh);
  return math.multiply(1 / (2 * m), math.subtract(nytlh, omytlomh));
};