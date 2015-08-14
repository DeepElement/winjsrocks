require('./runtime');
require('./winjs.shim');
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
          windowHelper.loadResources(stylesheets.map(function(s) {
            return {
              type: 'stylesheet',
              url: s
            };
          }), cb);
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
          }), cb);
        } else
          return cb();
      }
    ],
    function(err) {
      return done();
    });
};

exports.load = function(options, done) {
  var messageHooks = options.messageHooks || {};
  async.each(ioc.getServiceKeys(),
    function(key, keyCb) {
      var serviceInstance = ioc.getService(key);
      serviceInstance.start({}).done(keyCb);
    },
    function(err) {
      if (err)
        return done(err);

      var MessageService = ioc.getService("message");
      for (var handler in messageHooks)
        MessageService.register(handler, messageHooks[handler]);

      // notify of app ready
      MessageService.send("applicationReadyMessage");

      return done();
    });
};

exports.unload = function(options, done) {
  async.each(ioc.getServiceKeys(),
    function(key, keyCb) {
      var serviceInstance = ioc.getService(key);
      serviceInstance.stop({}).done(keyCb);
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
      var serviceInstance = ioc.getService(key);
      serviceInstance.pause({}).done(keyCb);
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
      var serviceInstance = ioc.getService(key);
      serviceInstance.resume({}).done(keyCb);
    },
    function(err) {
      if (err)
        return done(err);
      return done();
    });
};