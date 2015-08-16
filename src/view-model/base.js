var WinJS = require('winjs'),
    ioc = require('../ioc'),
    mixins = require('../helper/mixins');

var _constructor = function(options) {
    var that = this;
    this._loadingState = "loading";

    ioc.getServiceKeys().forEach(function(key) {
        that[key.capitalizeFirstLetter() + "Service"] = ioc.getService(key);
    });

    this._initialLoadTimerId = this.ApplicationService.setTimeout(function(){
        if(that._loadingState != "loaded")
            that.MessageService.send("viewLoadTimeoutMessage", this.key);
        that.ApplicationService.clearTimeout(this._initialLoadTimerId);
    }, 10000);
};

var instanceMembers = {
    _super: {
        get: function() {
            return Object.getPrototypeOf(this);
        }
    },

    getKey: function() {
        return this._key;
    },

    setKey: function(val) {
        this._key = val;
        this.notify("key");
    },

    onDataSet: function() {
        console.log("ViewModel:onDataSet");
        var that = this;
        this.notifyLoading();
    },

    getData: function() {
        return this._data;
    },

    setData: function(val) {
        console.log("ViewModel:setData");
        this._data = val;
        this.notifyLoading();
        this.notify('data');
        this.onDataSet();
    },

    onNavigateTo: function() {
        console.log("ViewModel:onNavigateTo");
    },

    onNavigateFrom: function() {
        console.log("ViewModel:onNavigateFrom");
    },

    getLoadingState: function() {
        return this._loadingState;
    },

    notifyLoading: function() {
        this._loadingState = "loading";
        this.notify("loadingState");
    },

    notifyLoaded: function() {
        this._loadingState = "loaded";
        this.notify("loadingState");
    }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
    instanceMembers, staticMembers);
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
