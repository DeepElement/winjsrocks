var WinJS = require('winjs');

var _constructor = function(options) {

};

var instanceMembers = {
    _super: {
        get: function() {
            return Object.getPrototypeOf(this);
        }
    }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor, instanceMembers, staticMembers);
