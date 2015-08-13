var ioc = require('../ioc'),
    base = require('./base'),
    async = require('async'),
    aop = require('../helper/aop'),
    WinJS = require("winjs");

var _constructor = function(options) {
    this.base.call(this, arguments);
    this._registery = {};
}

var instanceMembers = {
    start: function() {
        var that = this;
        return base.prototype.start.apply(this, arguments).then(function() {
            that._registery = that._registery || {};
        });
    },

    register: function(messageType, delegate) {
        var that = this;
        that._registery[messageType] = that._registery[messageType] || [];
        that._registery[messageType].push(delegate);
    },

    isRegistered: function(messageType) {
        var that = this;
        return that._registery[messageType] && that._registery[messageType].length > 0;
    },

    unregister: function(messageType, delegate) {
        var that = this;
        that._registery[messageType] = that._registery[messageType] || [];
        if (that._registery[messageType].indexOf(delegate) > -1)
            that._registery[messageType].splice(that._registery[messageType].indexOf(delegate), 1);
    },

    send: function(messageType, args) {
        var that = this;
        that._registery[messageType] = that._registery[messageType] || [];
        that._registery[messageType].forEach(function(delegate){
            delegate(messageType, args);
        });

        aop.notifyServices(messageType, [messageType, args]);
    },

    stop: function() {
        var that = this;
        return base.prototype.start.apply(this, arguments)
            .then(function() {
                that._registery = null;
            });
    }
};

module.exports = WinJS.Class.derive(base, _constructor, instanceMembers);
