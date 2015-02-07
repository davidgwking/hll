/*eslint-disable*/

// global object is available to benchmarks
global.hll = require('../../lib/hll');

// benchmark assets
var strings = global.strings = require('../../test/assets/cities');
var bVariations = [4, 5, 6, 7, 8, 9, 10, 11, 12];
var hashVariations = [
  {name: 'mumurhash3 (32-bit)', digestSize: 32},
  {name: 'mumurhash3 (128-bit)', digestSize: 128}
];

// define benchmarks
var benchmarks = module.exports = [];

bVariations.forEach(function (bVariation) {

  hashVariations.forEach(function (hashVariation) {

    benchmarks.push({
      name: 'hll.estimate : '  + hashVariation.name + ' : bitSampleSize=' + bVariation,
      setup:
        'var myHll = global.hll({digestSize: ' + hashVariation.digestSize + ', bitSampleSize: ' + bVariation + '});' +
        'global.strings.forEach(myHll.insert);',
      fn: 'myHll.estimate();'
    });

  });

});
