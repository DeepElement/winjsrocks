var WinJS = require('winjs'),
  base = require('./base');

var _constructor = function(options) {

};

var instanceMembers = {
  onApplicationReady: function(){
    base.prototype.onApplicationReady.call(this);
  }
};

var staticMembers = {

};

module.exports = WinJS.Class.derive(base, _constructor,
  instanceMembers, staticMembers);
