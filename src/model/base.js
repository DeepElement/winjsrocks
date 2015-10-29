var WinJS = require('winjs'),
  mixins = require('../helper/mixins');

var _constructor = function(options) {
  options = options || {};
  this._contentType = options.contentType || "none";
};

var instanceMembers = {
  _super: {
    get: function() {
      return Object.getPrototypeOf(this);
    }
  },
  getContentType: function() {
    return this._contentType;
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

module.exports = WinJS.Class.define(_constructor,
  instanceMembers, staticMembers);
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
WinJS.Class.mix(module.exports, mixins.autoProperty);
