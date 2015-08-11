var WinJS = require('winjs');

var _constructor = function(options) {

};

var instanceMembers = {
  start: function(options, callback) {
    if (callback)
      return callback();
  },
  onApplicationReady: function(){
    // called when all services have loaded
  },
  stop: function(options, callback) {
    if (callback)
      return callback();
  },
  pause: function(options, callback) {
    if (callback)
      return callback();
  },
  resume: function(options, callback) {
    if (callback)
      return callback();
  }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
  instanceMembers, staticMembers);
