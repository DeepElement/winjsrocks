var WinJS = require('winjs'),
    base = require('./base');

var _constructor = function(options) {
    base.apply(this, arguments);
};

var instanceMembers = {
    ready: function() {
        base.prototype.ready.apply(this, arguments);
    }
};

var staticMembers = {

};

module.exports = WinJS.Class.derive(base, _constructor,
    instanceMembers, staticMembers);
