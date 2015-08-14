var WinJS = require('winjs'),
    ioc = require('../ioc'),
    mixins = require('../helper/mixins');

var _constructor = function(options) {
    //this.ApplicationService = ioc.get("application");
    this._loadingState = "loading";
};

var instanceMembers = {
    _super: {
        get: function(){
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

        setTimeout(function(){
            that._loadingState = "loaded";
            that.notify("loadingState");
        }, 10000);
    },

    getData: function() {
        return this._data;
    },

    setData: function(val) {
        console.log("ViewModel:setData");
        this._data = val;
        this._loadingState = "loading";
        this.notify("loadingState");
        this.notify('data');
        this.onDataSet();
    },

    getLoadingState: function() {
        return this._loadingState;
    }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
    instanceMembers, staticMembers);
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
