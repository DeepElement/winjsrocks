import LifeCycle from "./common/lifecycle";
import ioc from "./ioc";
import async from "async";

export default class extends LifeCycle {
  constructor() {
    super();
  }

  configure(options, done) {
    options = options || {};
    async.waterfall([
        function(cb) {
          var appConfig = options["app-config"];
          if (appConfig)
            config.file(appConfig, cb);
          else
            return cb();
        },
        function(cb) {
          if (options.plugins) {
            async.each(options.plugins.filter(function(p) {
                return p instanceof require('./plugin/base');
              }),
              function(plugin, pluginCb) {
                plugin.load(pluginCb);
              },
              cb);
          } else
            return cb();
        }
      ],
      function(err) {
        if (err)
          return done(err);

        // setup the framework services/providers
        ioc.registerProvider("lokiStorage", require('./provider/loki-storage'));
        ioc.registerProvider("localStorage", require('./provider/local-storage'));

        ioc.registerService("navigation", require('./service/navigation'));
        ioc.registerService("message", require('./service/message'));
        ioc.registerService("application", require('./service/application'));
        ioc.registerService("data", require('./service/data'));

        return done();
      });
  }

  load(options, done) {
    super.load(options, function(err) {
      if (err)
        return done(err);
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

          // Enable features
          // TODO: dynamically add features
          require('./feature/platform').execute({}, function() {
            // notify of app ready
            MessageService.send("applicationReadyMessage");

            return done();
          });
        });
    });
  }

  unload(options, done) {
    super.unload(options, function(err) {
      if (err)
        return done(err);

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
    })
  }

  pause(options, done) {
    super.pause(options, function(err) {
      if (err)
        return done(err);

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
    })
  }

  resume(options, done) {
    super.resume(options, function(err) {
      if (err)
        return done(err);
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
    })
  }
};
