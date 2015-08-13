var WinJS = require('winjs'),
    mixins = require('../helper/mixins');

var _constructor = function(options) {

};

var instanceMembers = {
    key: {
        get: function(){
            return this._key;
        },
        set: function(val){
            this._key = val;
        }
    }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
    instanceMembers, staticMembers);
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
