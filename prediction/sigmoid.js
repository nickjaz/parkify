let math = require('mathjs');

module.exports = function(z) {
  return math.dotDivide(1, 1 +  math.exp(-z));
};