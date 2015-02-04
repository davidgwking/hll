var hash = require('./hash');
var fmt = require('util').format;

function hll(opts) {
  opts = opts || {};
  var b = opts.bitSampleSize = opts.bitSampleSize || 12;
  var digestSize = opts.digestSize = opts.digestSize || 128;
  validateInput(opts);

  var m = getNumberOfRegisters(b);
  var alpha = getAlpha(m);
  var registers = getRegisters(m);
  var standardError = getStandardError(m);

  function insert(value) {
    if (typeof value !== 'string')
      throw new TypeError(fmt(EINPUT_MUST_BE_STRING_F, typeof value));

    // hash value
    var h = hash(value, {digestSize: digestSize});

    // determine register index by extracting b LSBs
    var j = 1 + h.getLSBs(b);

    // get length of run of zeros immediately following bit sample
    var distance = h.getDistanceToNext1(b);

    // update register value
    registers[j - 1] = Math.max(registers[j - 1], distance);

    return {
      hash: h.value,
      registerIndex: j - 1,
      runOfZerosLength: distance,
      registerValue: registers[j - 1]
    };
  }

  function estimate() {
    var e = rawEstimate();

    // small range correction
    if (e <= (5 / 2) * m) {
      var v = 0;
      for (var i = 0; i < registers.length; i++) {
        if (registers[i] === 0) v++;
      }
      if (v !== 0) e = m * Math.log(m / v);
      else e = e;
    }
    // intermediate range, no correction
    else if (e <= (1 / 30) * Math.pow(2, 32)) e = e;
    // long range correction
    else if (e > (1 / 30) * Math.pow(2, 32))
      e = -1 * Math.pow(2, 32) * Math.log(1 - e / Math.pow(2, 32));

    return Math.floor(e + 0.5);
  }

  function rawEstimate() {
    // compute raw cardinality estimate
    var z = 0;
    for (var i = 0; i < registers.length - 1; i++) {
      z += Math.pow(2, -1 * registers[i]);
    }
    return (alpha * Math.pow(m, 2)) / z;
  }

  return {
    insert: insert,
    estimate: estimate,
    standardError: standardError
  };
}
module.exports = hll;

var EDIGEST_SZ_INVALID          = 'digestSize must be either 32 or 128.';
var ESAMPLE_SZ_TOO_LARGE        = 'bitSampleSize must be at most 12.';
var ESAMPLE_SZ_TOO_SMALL        = 'bitSampleSize must be at least 4.';
var ESAMPLE_SZ_MUST_BE_INTEGER  = 'bitSampleSize must be an integer.';
var EINPUT_MUST_BE_STRING_F     = 'Estimator input must be string, but found %s.';

function validateInput(opts) {
  if (opts.bitSampleSize < 4)
    throw new RangeError(ESAMPLE_SZ_TOO_SMALL);
  if (opts.bitSampleSize > 12)
    throw new RangeError(ESAMPLE_SZ_TOO_LARGE);
  if (opts.bitSampleSize % 1 !== 0)
    throw new RangeError(ESAMPLE_SZ_MUST_BE_INTEGER);
  if (opts.digestSize !== 32 && opts.digestSize !== 128)
    throw new RangeError(EDIGEST_SZ_INVALID);
}

function getNumberOfRegisters(b) {
  return Math.pow(2, b);
}

function getAlpha(m) {
  switch(m) {
    case 16:
      return 0.673;
    case 32:
      return 0.697;
    case 64:
      return 0.709;
    default:
      return 0.7213 / (1.0 + (1.079 / m));
  }
}

function getRegisters(m) {
  var registers = new Buffer(m);
  registers.fill(0);
  return registers;
}

function getStandardError(m) {
  return 1.04 / Math.sqrt(m);
}
