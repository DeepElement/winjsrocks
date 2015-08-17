var WinJS = require('winjs'),
    ioc = require('../ioc'),
    config = require('../config'),
    base = require('./base'),
    util = require("util");

var _constructor = function(options) {
    this._timeoutIds = [];
    this._intervalIds = [];
};

var instanceMembers = {

    stop: function() {
        var that = this;
        return base.prototype.start.apply(this, arguments)
            .then(function() {
                that._timeoutIds.forEach(function(t){
                    that.clearTimeout(t);
                });
                that._intervalIds.forEach(function(t){
                    that.clearInterval(t);
                });
            });
    },

    setTimeout: function(delegate, timeout) {
        var timerId = window.setTimeout(delegate, timeout);
        this._timeoutIds.push(timerId);
        return timerId;
    },

    setInterval: function(delegate, interval) {
        var intervalId = window.setInterval(delegate, interval);
        this._intervalIds.push(intervalId);
        return intervalId;
    },

    clearTimeout: function(timerId) {
        return window.clearTimeout(timerId);
    },

    clearInterval: function(timerId) {
        return window.clearInterval(timerId);
    }
};

var staticMembers = {

};

module.exports = WinJS.Class.derive(base, _constructor,
    instanceMembers, staticMembers);
