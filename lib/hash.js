var murmur = require('murmurhash3');


function hash(string, opts) {
  opts = opts || {};
  opts.digestSize = opts.digestSize || 128;

  // an array of 1 or 4 32-bit unsigned integers
  var h;
  switch(opts.digestSize) {
    case 32:
      h = [murmur.murmur32Sync(string)];
      break;
    case 128:
      h = murmur.murmur128Sync(string);
      break;
  }

  /**
   * Extracts the first n LSBs of the hased value.
   *
   * @param {Number} n number of bits to select
   */
  function getLSBs(n) {
    // shouldn't happen unless we support higher bit sample sizes
    if (n < 0 || n > 32) return -1;

    if (n === 32) return h[h.length - 1];
    return h[h.length - 1] & ((1 << n) - 1);
  }

  /**
   * Gets the distance from the nth bit to the next msb that has value 1. n is 1-based.
   *
   * @param {Number} n the bit from which to start measuring distance
   */
  function getDistanceToNext1(n) {
    // shouldn't happen unless we support higher bit sample sizes
    if (n < 0 || n > 32 * h.length) return -1;

    var data;
    var distance = 0;
    var arrayStart = h.length - 1 - ((n / 32) | 0);
    var arrayElementStart = n % 32;
    for (var i = arrayStart; i > -1; i--) {
      data = h[i] >>> arrayElementStart;
      for (var j = arrayElementStart; j < 32; j++) {
        distance++;
        if (data & 1) return distance;
        data >>>= 1;
      }
      arrayElementStart = 0;
    }

    return distance;
  }

  return {
    value: h,
    getLSBs: getLSBs,
    getDistanceToNext1: getDistanceToNext1
  };
}
module.exports = hash;
