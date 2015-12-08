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
import BindingMode from "./binding/mode";
import BindingTemplate from "./binding/template";
import WinJSHelper from "./helper/winjs";

let singelton = null;
export default class Application extends LifeCycle {
  constructor() {
    super();

    if (!singelton) {
      singelton = this;

      this._application = this;

      this._builder = new Builder(this);
      this._container = new Container(this);
      this._configuration = new Configuration(this);
      this._isConfigured = false;
      this._isLoaded = false;
      this._isPaused = false;
      this._instanceKey = MathHelper.v4;
      this._package = Package;
      this._bindingMode = new BindingMode(this);
      this._bindingTemplate = new BindingTemplate(this);
      this._plugins = [];
      this._pluginDefs = [];

      // TODO: make instance based
      this._logger = Logging;
    }

    require("./winjs.shim");

    WinJSHelper.markForProcessing(this);
    WinJSHelper.markForProcessing(this._bindingTemplate);
    WinJSHelper.markForProcessing(this._bindingMode);
  }

  static get Instance() {
    return singelton;
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

  get plugins() {
    return this._plugins;
  }

  get Binding() {
    return {
      Mode: this._bindingMode,
      Template: this._bindingTemplate
    }
  }

  configure(options, done) {
    var that = this;
    options = options || {};
    options.instanceKey = options.instanceKey || this.instanceKey;
    this._instanceKey = options.instanceKey;
    options.plugins = options.plugins || [];
    async.waterfall([
        function(cb) {
          var appConfig = options["app-config"];
          if (appConfig)
            that.configuration.file(appConfig, cb);
          else
            return cb();
        }
      ],
      function(err) {
        if (err)
          return done(err);

        // Filter down invalid stuffs
        that._plugins = options.plugins.filter(function(p) {
          return p.prototype instanceof PluginBase;
        }).map(function(pluginDef) {
          return new pluginDef(that);
        });

        async.each(that._plugins,
          function(plugin, pluginCb) {
            if(plugin["setup"])
              plugin.setup(options, pluginCb);
            else
              return pluginCb();
          },
          function(err) {
            if (err)
              return done(err);

              // setup the framework services/providers
              if (!that.container.isProviderRegistered("winjsrocks-loki-storage"))
                that.container.registerProvider("winjsrocks-loki-storage", require('./provider/loki-storage'));
              if (!that.container.isProviderRegistered("winjsrocks-local-storage"))
                that.container.registerProvider("winjsrocks-local-storage", require('./provider/local-storage'));

              if (!that.container.isServiceRegistered("winjsrocks-navigation"))
                that.container.registerService("winjsrocks-navigation", require('./service/navigation'));
              if (!that.container.isServiceRegistered("winjsrocks-message"))
                that.container.registerService("winjsrocks-message", require('./service/message'));
              if (!that.container.isServiceRegistered("winjsrocks-application"))
                that.container.registerService("winjsrocks-application", require('./service/application'));
              if (!that.container.isServiceRegistered("winjsrocks-data"))
                that.container.registerService("winjsrocks-data", require('./service/data'));

              that._isConfigured = true;

              return done();
          });
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

          var MessageService = that.container.getService("winjsrocks-message");
          for (var handler in messageHooks)
            MessageService.register(handler, messageHooks[handler]);

          that._isLoaded = true;
          that._isPaused = false;

          MessageService.send("applicationReadyMessage");

          async.each(that._plugins,
            function(plugin, pluginCb) {
              plugin.loadComponent(options, pluginCb);
            },
            function(err) {
              if (err)
                return done(err);

              return done();
            });
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

  WinJSPageDefine(viewKey, templateUri, baseClassDef, isItem) {
    var that = this;
    isItem = isItem || false;
    var existingBaseClass = WinJS.UI.Pages.define(templateUri);
    if (baseClassDef && existingBaseClass != baseClassDef) {
      var extendedClassDef = WinJS.UI.Pages.define(templateUri, {}, baseClassDef);
      that.application.container.overrideView(viewKey, extendedClassDef);
      that.configuration.set("pages:" + (isItem ? "item-" : "") + viewKey + ":template", templateUri);
      return extendedClassDef;
    }
    return existingBaseClass;
  }

};
