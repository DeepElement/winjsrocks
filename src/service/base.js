var WinJS = require('winjs'),
    mixins = require('../helper/mixins');

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
    },


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
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
WinJS.Class.mix(module.exports, mixins.autoProperty);
