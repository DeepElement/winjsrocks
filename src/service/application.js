import BaseService from "./base"

export default class extends BaseService {
  constructor(application) {
    super(application);

    this._timeoutIds = [];
    this._intervalIds = [];
    this._immediateIds = [];
  }

  unload(options, callback) {
    var that = this;
    super.upload(options, function(err) {
      if (err)
        return callback(err);

      that._timeoutIds.forEach(function(t) {
        that.clearTimeout(t);
      });
      that._intervalIds.forEach(function(t) {
        that.clearInterval(t);
      });
      that._immediateIds.forEach(function(t) {
        that.clearImmediate(t);
      });

      return callback();
    });
  }

  setTimeout(delegate, timeout) {
    var timerId = window.setTimeout(delegate, timeout);
    this._timeoutIds.push(timerId);
    return timerId;
  }

  setInterval(delegate, interval) {
    var intervalId = window.setInterval(delegate, interval);
    this._intervalIds.push(intervalId);
    return intervalId;
  }

  setImmediate(delegate) {
    if (typeof window.setImmediate !== 'function')
      window.setImmediate = window.setTimeout;
    var refId = window.setImmediate(delegate);
    this._immediateIds.push(refId);
    return refId;
  }

  clearTimeout(timerId) {
    return window.clearTimeout(timerId);
  }

  clearImmediate(refId) {
    return window.clearImmediate(refId);
  }

  clearInterval(timerId) {
    return window.clearInterval(timerId);
  }
}
