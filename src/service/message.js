import BaseService from "./base";
import Async from "async";
import StringHelper from "../helper/string";

export default class extends BaseService {
  constructor(application) {
    super(application);

    this._registery = {};
  }

  loadComponent(options, callback) {
    var that = this;
    super.loadComponent(options, function(err) {
      if (err)
        return callback(err);
      that._registery = that._registery || {};
      return callback();
    });
  }

  register(messageType, delegate) {
    var that = this;
    that._registery[messageType] = that._registery[messageType] || [];
    that._registery[messageType].push(delegate);
  }

  isRegistered(messageType) {
    var that = this;
    return that._registery[messageType] && that._registery[messageType].length > 0;
  }

  unregister(messageType, delegate) {
    var that = this;
    that._registery[messageType] = that._registery[messageType] || [];
    if (that._registery[messageType].indexOf(delegate) > -1)
      that._registery[messageType].splice(that._registery[messageType].indexOf(delegate), 1);
  }

  send(messageType, args) {
    var that = this;
    that._registery[messageType] = that._registery[messageType] || [];
    that._registery[messageType].forEach(function(delegate) {
      delegate(messageType, args);
    });

    // notify all container items of message
    this.notifyContainerInstances(messageType, [messageType, args]);
  }

  notifyContainerInstances(method, args, done) {
    var that = this;

    var components = [];
    var serviceInstances = that.application.container.getServiceKeys().map(function(s){
      return that.application.container.getService(s);
    });
    var viewModelInstances = that.application.container.getViewModelKeys().map(function(s){
      return that.application.container.getViewModel(s);
    });
    components.push(...serviceInstances);
    components.push(...viewModelInstances);

    Async.each(components,
      function(component, componentCb) {
        if (component["on" + StringHelper.capitalizeFirstLetter(method)])
          component["on" + StringHelper.capitalizeFirstLetter(method)].apply(component, args);
        return componentCb();
      },
      function(err) {
        if (done) {
          if (err)
            return done(err);
          return done();
        }
      })
  }

  unloadComponent(options, callback) {
    var that = this;
    super.unloadComponent(options, function(err) {
      if (err)
        return callback(err);
      that._registery = {};
      return callback();
    });
  }
}
