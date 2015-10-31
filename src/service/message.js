import BaseService from "./base"

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
