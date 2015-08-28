var ioc = require('./ioc'),
  async = require('async'),
  extend = require('extend-object'),
  WinJS = require('winjs');

var store = {};
exports.get = function(path) {
  try {
    var _context = resolve(path);
    return _context.scope[_context.property];
  } catch (ex) {
    return null;
  }
}

exports.getStore = function() {
  return store;
}

exports.assert = function(path) {
  if (!exports.get(path))
    throw new Error("Configuration " + path + " not present");
}

exports.set = function(path, value) {
  var parts = path.split(':');
  var scope = store;
  if (parts.length > 1) {
    for (var i = 0; i <= parts.length - 2; i++) {
      if (!scope[parts[i]])
        scope[parts[i]] = {};
      scope = scope[parts[i]];
    }
  }
  var property = parts[parts.length - 1];
  scope[property] = value;
}

exports.defaults = function(defaultConfig) {
  extend(store, defaultConfig);
}

var resolve = function(path) {
  var parts = path.split(':');
  var scope = store;
  if (parts.length > 1) {
    for (var i = 0; i <= parts.length - 2; i++) {
      scope = scope[parts[i]];
    }
  }
  var property = parts[parts.length - 1];
  if (!property || !scope[property])
    throw new Error(path + " not defined");

  var result = {
    scope: scope,
    property: property
  };
  return result;
}

exports.file = function(path, callback) {
  exports.loadFile(path,
    function(err, respObj) {
      if (err)
        return callback(err);
      extend(store, respObj);
      return callback();
    });
}

exports.loadFile = function(path, callback) {
  var result = null;

  async.waterfall([
      function(done) {
        WinJS.xhr({
            url: path
          })
          .done(function(resp) {
              result = resp.response;
              return done();
            },
            function(result) {
              return done();
            });
      },
      function(done) {
        if (!result) {
          if (!(typeof location === "undefined")) {
            var browserCompatiblePath = path.replace("ms-appx://",
              location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''));
            WinJS.xhr({
              url: browserCompatiblePath
            }).done(function(resp) {
                result = resp.response;
                return done();
              },
              function(result) {
                return done();
              });
          } else {
            result = require(path);
            return done();
          }
        } else
          return done();
      }
    ],
    function(err) {
      if (err)
        return callback();
      return callback(null, result);
    });
}
