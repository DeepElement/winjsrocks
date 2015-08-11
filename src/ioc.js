var Momentr = require('momentr');
var _container = new Momentr();
var _validScopes = ["request", "application", "session"];

var _viewModelPrefix = "viewModel_",
  _servicePrefix = "service_",
  _providerPrefix = "provider_";

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
  return _container.register(_servicePrefix + key, clazz, 'application');
};

exports.registerProvider = function(key, clazz){
  return _container.register(_providerPrefix + key, clazz, 'request');
};

exports.registerViewModel = function(key, clazz){
  return _container.register(_viewModelPrefix + key, clazz, 'application');
}

exports.getProvider = function(key){
  return _container.get(_providerPrefix + key);
}

exports.getService = function(key){
  return _container.get(_servicePrefix + key);
}

exports.getViewModel = function(key){
  return _container.get(_viewModelPrefix + key);
}
