var WinJS = require('winjs'),
    mixins = require('../helper/mixins');

var _constructor = function(element, options) {
    var that = this;
    this._viewModel = options;
    this._super.apply(this, arguments);

    this._onLoadingStateChangedBinding = this._onLoadingStateChanged.bind(this);
};

var instanceMembers = {

    _onLoadingStateChanged: function() {
        if (this.getViewModel().getLoadingState() == "loaded") {
            WinJS.UI.processAll(this.element);
            WinJS.Binding.processAll(this.element, this.getViewModel());
            WinJS.Resources.processAll(this.element);
        }
    },

    getData: function() {
        if (this._viewModel)
            return this._viewModel.data;
        return null;
    },

    render: function(element, options, loadResult) {
        console.log("View::render");
        return this._super.prototype.render.apply(this, arguments);
    },

    init: function(element, options) {
        console.log("View::init");
        this.getViewModel().addEventListener("loadingState", this._onLoadingStateChangedBinding);
        return this._super.prototype.init.apply(this, arguments);
    },

    dispose: function() {
        console.log("View::dispose");
        this.viewModel.removeEventListener("loadingState", this._onLoadingStateChangedBinding);
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
        }).done(function() {
            that._onLoadingStateChanged();
        });
    },

    ready: function() {
        console.log("View::Ready");
        this._super.prototype.ready.apply(this, arguments);
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
