var ioc = require('../ioc'),
  async = require('async');

var _constructor = function(options) {
}

var instanceMembers = {
  start: function() {
    var that = this;
    return base.prototype.start.apply(this, arguments).then(function() {
      that._registery = [];
    });
  },

  register: function(messageType, delegate) {

  },

  isRegistered: function(messageType) {

  },

  unregister: function(messageType, delegate) {

  },

  send: function(messageType, args) {

  },

  stop: function() {
    var that = this;
    return base.prototype.start.apply(this, arguments)
      .then(function() {
        that._registery = null;
      });
  };
};

module.exports = WinJS.Class.derive(base, _constructor, instanceMembers);
