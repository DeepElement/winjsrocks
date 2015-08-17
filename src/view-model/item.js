var WinJS = require('winjs'),
  base = require('./base');

var _constructor = function(options) {
  base.call(this, arguments);
};

var instanceMembers = {
  getItem: function(){
    return this.getData();
  }
};

var staticMembers = {

};

module.exports = WinJS.Class.derive(base, _constructor,
  instanceMembers, staticMembers);
