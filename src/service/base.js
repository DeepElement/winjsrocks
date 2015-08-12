var WinJS = require('winjs');

var _constructor = function(options) {

};

var instanceMembers = {
  start: function(options) {
    return WinJS.Promise.as();
  },

  onApplicationReady: function() {
    // called when all services have loaded
  },

  stop: function(options) {
    return WinJS.Promise.as();
  },
  pause: function(options) {
    return WinJS.Promise.as();
  },
  resume: function(options) {
    return WinJS.Promise.as();
  }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
  instanceMembers, staticMembers);
