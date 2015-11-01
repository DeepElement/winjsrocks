import WinJS from "winjs";
import LifeCycle from "./common/lifecycle";
import Container from "./container";
import async from "async";
import Logging from "./log";
import Configuration from "./configuration";
import Builder from "./builder";
import ApplicationException from "./exception/base";
import MathHelper from "./helper/math";
import Package from '../package.json';
import PluginBase from "./plugin/base";

export default class extends LifeCycle {
  constructor() {
    super();
    this._application = this;

    this._builder = new Builder(this);
    this._container = new Container(this);
    this._configuration = new Configuration(this);
    this._isConfigured = false;
    this._isLoaded = false;
    this._isPaused = false;
    this._instanceKey = MathHelper.v4;
    this._package = Package;

    // TODO: make instance based
    this._logger = Logging;

    require("./winjs.shim");
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

  get isConfigured() {
    return this._isConfigured;
  }

  get isLoaded() {
    return this._isLoaded;
  }

  get isPaused() {
    return this._isPaused;
  }

  get instanceKey() {
    return this._instanceKey;
  }

  configure(options, done) {
    var that = this;
    options = options || {};
    options.instanceKey = options.instanceKey || this.instanceKey;
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
            async.each(options.plugins,
              function(plugin, pluginCb) {
                plugin.loadComponent(options, pluginCb);
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
        if (!that.container.isProviderRegistered("lokiStorage"))
          that.container.registerProvider("lokiStorage", require('./provider/loki-storage'));
        if (!that.container.isProviderRegistered("localStorage"))
          that.container.registerProvider("localStorage", require('./provider/local-storage'));

        if (!that.container.isServiceRegistered("navigation"))
          that.container.registerService("navigation", require('./service/navigation'));
        if (!that.container.isServiceRegistered("message"))
          that.container.registerService("message", require('./service/message'));
        if (!that.container.isServiceRegistered("application"))
          that.container.registerService("application", require('./service/application'));
        if (!that.container.isServiceRegistered("data"))
          that.container.registerService("data", require('./service/data'));

        that._isConfigured = true;

        return done();
      });
  }

  load(options, done) {
    var that = this;

    if (!this.isConfigured)
      return done(new ApplicationException("Call configure before load"));

    super.loadComponent(options, function(err) {
      if (err)
        return done(err);

      var messageHooks = options.messageHooks || {};
      async.each(that.container.getServiceKeys(),
        function(key, keyCb) {
          var serviceInstance = that.container.getService(key);
          serviceInstance.loadComponent({}, keyCb);
        },
        function(err) {
          if (err)
            return done(err);

          var MessageService = that.container.getService("message");
          for (var handler in messageHooks)
            MessageService.register(handler, messageHooks[handler]);

          that._isLoaded = true;
          that._isPaused = false;

          MessageService.send("applicationReadyMessage");

          return done();
        });
    });
  }

  unload(options, done) {
    var that = this;

    if (!this.isConfigured)
      return done(new ApplicationException("Call configure calling unload"));

    if (!this.isLoaded)
      return done(new ApplicationException("Call load before calling unload"));


    super.unloadComponent(options, function(err) {
      if (err)
        return done(err);

      async.each(that.container.getServiceKeys(),
        function(key, keyCb) {
          var serviceInstance = that.container.getService(key);
          serviceInstance.unloadComponent({}, keyCb);
        },
        function(err) {
          if (err)
            return done(err);

          that._isLoaded = false;
          that._isPaused = false;

          return done();
        });
    })
  }

  pause(options, done) {
    var that = this;

    if (!this.isConfigured)
      return done(new ApplicationException("Call configure calling pause"));

    if (!this.isLoaded)
      return done(new ApplicationException("Call load before calling pause"));

    if (this.isPaused)
      return done(new ApplicationException("Application already paused"));

    super.pause(options, function(err) {
      if (err)
        return done(err);

      async.each(that.container.getServiceKeys(),
        function(key, keyCb) {
          var serviceInstance = that.container.getService(key);
          serviceInstance.pause({}, keyCb);
        },
        function(err) {
          if (err)
            return done(err);

          that._isPaused = true;

          return done();
        });
    })
  }

  resume(options, done) {
    var that = this;

    if (!this.isConfigured)
      return done(new ApplicationException("Call configure calling resume"));

    if (!this.isLoaded)
      return done(new ApplicationException("Call load before calling resume"));

    if (!this.isPaused)
      return done(new ApplicationException("Call pause before calling resume"));


    super.resume(options, function(err) {
      if (err)
        return done(err);
      async.each(that.container.getServiceKeys(),
        function(key, keyCb) {
          var serviceInstance = that.container.getService(key);
          serviceInstance.resume({}, keyCb);
        },
        function(err) {
          if (err)
            return done(err);

          that._isPaused = false;

          return done();
        });
    })
  }

  WinJSPageDefine(viewKey, templateUri, baseClassDef) {
    var that = this;
    var existingBaseClass = WinJS.UI.Pages.define(templateUri);
    if (baseClassDef && existingBaseClass != baseClassDef) {
      var extendedClassDef = WinJS.UI.Pages.define(templateUri, {}, baseClassDef);
      that.application.container.overrideView(viewKey, extendedClassDef);
      that.configuration.set("pages:" + viewKey + ":template", templateUri);
      return extendedClassDef;
    }
    return existingBaseClass;
  }

};
