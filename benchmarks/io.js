/*eslint-disable*/

var fmt = require('util').format;

function out(prefix) {
  args = Array.prototype.slice.call(arguments, 1);
  args.splice(1, 0, arguments[0]);
  args[0] = '[%s] ' + args[0];
  var str = fmt.apply(null, args);
  console.log(str);
}
var info = module.exports.info = out.bind(null, 'INFO');
var error = module.exports.error = out.bind(null, 'ERROR');

function sep(io) { io('========================================='); }

function startSuite(name) {
  sep(info);
  info('STARTING SUITE: %s', name);
  sep(info);
}
module.exports.startSuite = startSuite;

function suiteNotFound(name) {
  sep(error);
  error('SUITE NOT FOUND: %s', name);
  sep(error);
}
module.exports.suiteNotFound = suiteNotFound;
