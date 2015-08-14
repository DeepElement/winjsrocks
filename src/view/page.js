var WinJS = require('winjs'),
    base = require('./base');

var _constructor = function(options) {
    Object.getPrototypeOf(this).apply(this, arguments);
};

var instanceMembers = {
    ready: function() {
        debugger
        this.super.ready.apply(this, arguments);
    }
};

var staticMembers = {

};

module.exports = WinJS.Class.derive(base, _constructor,
    instanceMembers, staticMembers);
