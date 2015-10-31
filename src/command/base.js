var WinJS = require('winjs'),
  mixins = require('../helper/mixins');

// RelayCommand Constructor
// ----------------------
function _constructor(payload, key) {
  var _self = this;
  _self._key = key;
  _self._internalExecute = payload || function() {};
  _self.execute = function() {
    return _self._internalExecute.apply(_self, arguments);
  };
  _self.canExecute = true;
}

// RelayCommand Methods
// ------------------
var instanceMembers = {
  execute: null,
  canExecute: null,
  application: {
    get: function() {
      return this._application;
    },
    set: function(value) {
      this._application = value;
    }
  }
};

var staticMembers = {};

module.exports = WinJS.Class.define(_constructor,
  instanceMembers, staticMembers);
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
