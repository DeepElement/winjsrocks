var Momentr = require('momentr');
var _container = new Momentr();
var _validScopes = ["request", "application", "session"];

exports.getRegisteredKeys = function() {
  return _container.getRegisteredKeys();
};

exports.getAllInstances = function() {
  return _container.getAllInstances();
};

exports.get = function(key) {
  return _container.get(key);
};

exports.clear = function() {
  return _container.clear();
};

exports.override = function(key, clazz) {
  return _container.override(key, clazz);
};

exports.registerService = function(key, clazz){
  return _container.register(key, clazz, 'application');
};

exports.registerProvider = function(key, clazz){
  return _container.register(key, clazz, 'request');
};

exports.registerViewModel = function(key, clazz){
  return _container.register(key, clazz, 'application');
}
