/*eslint-disable*/

process.title = 'hllbenchmarks';

module.exports = function init() {
  var argv = require('minimist')(process.argv.slice(2));

  // help
  if (argv.help || argv.h) {
    console.log('Usage: hllbenchmarks [-h] [--help] [suite ...]');
    process.exit(0);
  }

  var config = {};

  // cli suite specification
  if (argv._.length > 0) config.suites = argv._;

  return config;
};
