/*eslint-disable*/

// global object is available to benchmarks
global.hll = require('../../lib/hll');

// benchmark assets
var strings = require('../../test/assets/cities').slice(0, 20);
var hashVariations = [
  {name: 'mumurhash3 (32-bit)', digestSize: 32},
  {name: 'mumurhash3 (128-bit)', digestSize: 128}
];

// define benchmarks
var benchmarks = module.exports = [];

strings.forEach(function (string) {

  hashVariations.forEach(function (hashVariation) {

    benchmarks.push({
      name: 'hll.insert : ' + hashVariation.name + ' : ' + string,
      setup: 'var myHll = global.hll({digestSize: ' + hashVariation.digestSize + '});',
      fn: 'myHll.insert(\'' + string + '\');'
    });

  });

});
