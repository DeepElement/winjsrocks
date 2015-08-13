var WinJS = require('winjs');

var _constructor = function(options) {
  this._super.apply(this, arguments);
  this._viewModel = options.viewModel;
};

var instanceMembers = {
  getAnimationElements: function(){
    return [];
  },

  getViewModel : function(){
    return this._viewModel;
  },

  /* Generally called on Window Resize */
  updateLayout: function(){

  }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
  instanceMembers, staticMembers);
