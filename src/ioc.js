require("./runtime");
var Momentr = require('momentr');
var _container = new Momentr();
var _validScopes = ["request", "application"];

var exportsConfig = [{
  type: "itemViewModel",
  prefix: "itemViewModel_",
  scope: "request"
}, {
  type: "viewModel",
  prefix: "viewModel_",
  scope: "request"
}, {
  type: "provider",
  prefix: "provider_",
  scope: "request"
}, {
  type: "service",
  prefix: "service_",
  scope: "application"
}, {
  type: "itemModel",
  prefix: "itemModel_",
  scope: "request"
}, {
  type: "view",
  prefix: "view_",
  scope: "request"
}, {
  type: "itemView",
  prefix: "itemView_",
  scope: "request"
}];


exports.getRegisteredKeys = function() {
  return _container.getRegisteredKeys();
};

exportsConfig.forEach(function(config) {
  var caseType = config.type.capitalizeFirstLetter();
  exports["get" + caseType + "Keys"] = function() {
    var keys = _container.getRegisteredKeys();
    return keys.filter(function(f) {
      return f.indexOf(config.prefix) == 0;
    }).map(function(f) {
      return f.substr(config.prefix.length);
    });
  };

  exports["get" + caseType] = function(key) {
    return _container.get(config.prefix + key);
  };

  exports["override" + caseType] = function(key, classDef) {
    return _container.override(config.prefix + key, classDef);
  };

  exports["get" + caseType + "Def"] = function(key) {
    return _container.def(config.prefix + key).type;
  };

  exports["register" + caseType] = function(key, clazz) {
    return _container.register(config.prefix + key, clazz, config.scope);
  };

  exports["del" + caseType + "Instance"] = function(key, instance) {
    console.log('b');
    return _container.del(config.prefix + key, instance);
  };
});

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
