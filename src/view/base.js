var WinJS = require('winjs'),
    mixins = require('../helper/mixins');

var _constructor = function(element, options) {
    this._super.apply(this, arguments);

    this._viewModel = options;
};

var instanceMembers = {
    ready: function(element, options) {
        console.log("override");
    },

    getAnimationElements: function() {
        return [];
    },

    getViewModel: function() {
        return this._viewModel;
    },

    /* Generally called on Window Resize */
    updateLayout: function() {

    }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
    instanceMembers, staticMembers);
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
