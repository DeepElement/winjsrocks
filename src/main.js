require('./runtime');
require('./setup');

var config = require('./config'),
  async = require('async'),
  windowHelper = require('./helper/window'),
  aop = require('./helper/aop'),
  ioc = require('./ioc');

exports.configure = function(options, done) {
  async.waterfall([
      function(cb) {
        // load app config
        var appConfig = options["app-config"];
        if (appConfig)
          config.file(appConfig, cb);
        else
          return cb();
      },
      function(cb) {
        // load styles series
        var stylesheets = config.get("resources:stylesheets");
        if (stylesheets) {
          windowHelper.loadResourcesSeries(stylesheets.map(function(s) {
            return {
              type: 'stylesheet',
              url: s
            };
          }));
        } else
          return cb();
      },
      function(cb) {
        // load scripts series
        var scripts = config.get("resources:scripts");
        if (scripts) {
          windowHelper.loadResourcesSeries(scripts.map(function(s) {
            return {
              type: 'script',
              url: s
            };
          }));
        } else
          return cb();
      }
    ],
    done);
};

exports.load = function(options, done) {
  async.each(ioc.getServiceKeys(),
    function(key, keyCb) {
      var serviceInstance = ioc.get(key);
      serviceInstance.start({}, keyCb);
    },
    function(err) {
      if (err)
        return done(err);

      aop.notifyServices('applicationReady');

      return done();
    });
};

exports.unload = function(options, done) {
  async.each(ioc.getServiceKeys(),
    function(key, keyCb) {
      var serviceInstance = ioc.get(key);
      serviceInstance.stop({}, keyCb);
    },
    function(err) {
      if (err)
        return done(err);
      return done();
    });
};

exports.pause = function(options, done) {
  async.each(ioc.getServiceKeys(),
    function(key, keyCb) {
      var serviceInstance = ioc.get(key);
      serviceInstance.pause({}, keyCb);
    },
    function(err) {
      if (err)
        return done(err);
      return done();
    });
};

exports.resume = function(options, done) {
  async.each(ioc.getServiceKeys(),
    function(key, keyCb) {
      var serviceInstance = ioc.get(key);
      serviceInstance.resume({}, keyCb);
    },
    function(err) {
      if (err)
        return done(err);
      return done();
    });
};
