import LifeCycle from "./common/lifecycle";
import Container from "./ioc";
import async from "async";
import Logging from "./log";
import Configuration from "./config";
import Builder from "./builder";

export default class extends LifeCycle {
  constructor() {
    super();

    // TODO: make instance based
    this._logger = Logging;

    // TODO: make instance based
    this._container = Container;

    // make instance based
    this._builder = Builder;

    // TODO: make instance based
    this._configuration = Configuration;
  }

  get container() {
    return this._container;
  }

  get logger() {
    return this._logger;
  }

  get builder() {
    return this._builder;
  }

  get configuration() {
    return this._configuration;
  }

  configure(options, done) {
    var that = this;
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
        that.container.registerProvider("lokiStorage", require('./provider/loki-storage'));
        that.container.registerProvider("localStorage", require('./provider/local-storage'));

        that.container.registerService("navigation", require('./service/navigation'));
        that.container.registerService("message", require('./service/message'));
        that.container.registerService("application", require('./service/application'));
        that.container.registerService("data", require('./service/data'));

        return done();
      });
  }

  load(options, done) {
    var that = this;
    super.load(options, function(err) {
      if (err)
        return done(err);
      var messageHooks = options.messageHooks || {};
      async.each(that.container.getServiceKeys(),
        function(key, keyCb) {
          var serviceInstance = that.container.getService(key);
          serviceInstance.start({}).done(keyCb);
        },
        function(err) {
          if (err)
            return done(err);

          var MessageService = that.container.getService("message");
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
    var that = this;
    super.unload(options, function(err) {
      if (err)
        return done(err);

      async.each(that.container.getServiceKeys(),
        function(key, keyCb) {
          var serviceInstance = that.container.getService(key);
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
    var that = this;
    super.pause(options, function(err) {
      if (err)
        return done(err);

      async.each(that.container.getServiceKeys(),
        function(key, keyCb) {
          var serviceInstance = that.container.getService(key);
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
    var that = this;
    super.resume(options, function(err) {
      if (err)
        return done(err);
      async.each(that.container.getServiceKeys(),
        function(key, keyCb) {
          var serviceInstance = that.container.getService(key);
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
