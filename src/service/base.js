var WinJS = require('winjs'),
    mixins = require('../helper/mixins');
    
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
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
