var WinJS = require('winjs'),
    mixins = require('../helper/mixins');

var _constructor = function(element, options) {
    var that = this;
    this._viewModel = options;
    this._super.apply(this, arguments);
};

var instanceMembers = {
    _super: {
        get: function(){
            console.log("called");
            return Object.getPrototypeOf(this);
        }
    },

    getData: function() {
        if (this._viewModel)
            return this._viewModel.data;
        return null;
    },

    init: function(element, options) {
        console.log("View::init");
        return this._super.prototype.init.apply(this, arguments);
    },

    dispose: function() {
        console.log("View::dispose");
        return this._super.prototype.dispose.apply(this, arguments);
    },

    processed: function(element, options) {
        var that = this;
        console.log("View::Processed");
        return new WinJS.Promise(function(complete, error, progress) {
            if (that._viewModel.getLoadingState() == "loading") {
                var callbackDelegate = function() {
                    if (that._viewModel.getLoadingState() == "loaded") {
                        that._viewModel.removeEventListener("loadingState", callbackDelegate);
                        return complete();
                    }
                };
                that._viewModel.addEventListener("loadingState", callbackDelegate);
            } else
                return complete();
        });
    },

    ready: function() {
        console.log("View::Ready");
        this._super.prototype.ready.apply(this, arguments);
    },

    onBindingReady: function() {

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
