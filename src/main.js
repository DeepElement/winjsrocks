require('./runtime');
require('./setup');

var config = require('./config');

exports.configure = function(options, done) {
  var appConfig = options["app-config"];
  if (appConfig)
    config.file(appConfig, done);
  else
    return done();
};

exports.load = function(options, done) {

  console.log(config.get("view"));

  if (done)
    return done();
};

exports.unload = function(options, done) {
  if (done)
    return done();
};

exports.pause = function(options, done) {
  if (done)
    return done();
};

exports.resume = function(options, done) {
  if (done)
    return done();
};
