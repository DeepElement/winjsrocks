var WinJS = require('winjs');

var _constructor = function(options) {

};

var instanceMembers = {
  _super: {
    get: function() {
      return Object.getPrototypeOf(this);
    }
  },
  application: {
    get: function() {
      return this._application;
    },
    set: function(value) {
      this._application = value;
    }
  }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor, instanceMembers, staticMembers);
