/*eslint-disable*/

// global object is available to benchmarks
global.hll = require('../../lib/hll');
global.hash = require('../../lib/hash');

// benchmark assets
var strings = require('../../test/assets/cities').slice(0, 10);
var hashVariations = [
  {name: 'mumurhash3 (32-bit)  : insert', digestSize: 32},
  {name: 'mumurhash3 (128-bit) : insert', digestSize: 128}
];

// define benchmarks
var benchmarks = module.exports = [];

strings.forEach(function (string, j) {

  hashVariations.forEach(function (hashVariation, i) {

    benchmarks.push({
      name: hashVariation.name + ' : ' + string,
      setup: 'var myHll = global.hll({digestSize: ' + hashVariation.digestSize + '});',
      fn: 'myHll.insert(\'' + string + '\');'
    });

  });

});
