var murmur = require('murmurhash3').murmur128Sync;

function hash(string) {
  // an array of 4 32-bit unsigned integers
  var h = murmur(string);

  /**
   * Extracts the first n LSBs of the hased value.
   *
   * @param {Number} n number of bits to select
   */
  function getLSBs(n) {
    // shouldn't happen unless we support higher bit sample sizes
    if (n < 0 || n > 32) return -1;

    if (n === 32) return h[3];
    return h[3] & ((1 << n) - 1);
  }

  /**
   * Gets the distance from the nth bit to the next msb that has value 1. n is 1-based.
   *
   * @param {Number} n the bit from which to start measuring distance
   */
  function getDistanceToNext1(n) {
    // shouldn't happen unless we support higher bit sample sizes
    if (n < 0 || n > 128) return -1;

    var data;
    var pos = 0;
    var distance = 0;
    for (var i = h.length - 1; i > -1; i--) {
      data = h[i];
      for (var q = 0; q < 32; q++) {
        if (pos < n) {
          pos++;
          data >>>= 1;
          continue;
        }
        distance++;
        if (data & 0x1) return distance;
        data >>>= 1;
      }
    }

    return 0;
  }

  return {
    value: h,
    getLSBs: getLSBs,
    getDistanceToNext1: getDistanceToNext1
  };
}
module.exports = hash;
