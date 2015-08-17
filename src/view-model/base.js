var WinJS = require('winjs'),
  ioc = require('../ioc'),
  mixins = require('../helper/mixins'),
  log = require('../log');

var _constructor = function(options) {
  var that = this;
  this._loadingState = "loading";
  this._itemViewModels = [];

  ioc.getServiceKeys().forEach(function(key) {
    that[key.capitalizeFirstLetter() + "Service"] = ioc.getService(key);
  });

  this._initialLoadTimerId = this.ApplicationService.setTimeout(function() {
    if (that._loadingState != "loaded")
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

  addItemViewModels: function(models) {
    var that = this;
    var results = [];
    models.forEach(function(model){
      results.push(that.addItemViewModel(model));
    });
    return results;
  },

  addItemViewModel: function(model) {
    var itemViewModel = ioc.getItemViewModel(model.getContentType());
    if (itemViewModel) {
      itemViewModel.setData(model);
      this._itemViewModels.push(itemViewModel);
      this.notify("itemViewModels");
      return itemViewModel;
    }
    log.warn("ItemViewModel for " + model.getContentType() + " not found");
    return null;
  },

  removeItemViewModel: function(instance) {
    var instanceIdx = this._itemViewModels.indexOf(instance);
    if (instanceIdx > -1) {
      this._itemViewModels.slice(instanceIdx, 1);
      this.notify("itemViewModels");
      return true;
    }
    return false;
  },

  getItemViewModels: function() {
    return this._itemViewModels;
  },

  getBackNavigationDisabled: function() {
    return this._backNavigationDisabled || false;
  },

  setBackNavigationDisabled: function(val) {
    this._backNavigationDisabled = val;
    this.notify("backNavigationDisabled");
  },

  getKey: function() {
    return this._key;
  },

  setKey: function(val) {
    this._key = val;
    this.notify("key");
  },

  onDataSet: function() {
    log.log("ViewModel:onDataSet");
    var that = this;
    this.notifyLoading();
  },

  getData: function() {
    return this._data;
  },

  setData: function(val) {
    log.log("ViewModel:setData");
    this._data = val;
    this.notifyLoading();
    this.notify('data');
    this.onDataSet();
  },

  onNavigateTo: function() {
    log.log("ViewModel:onNavigateTo");

    this._itemViewModels.forEach(function(itemViewModel) {
      itemViewModel.onNavigateTo();
    });
  },

  onNavigateFrom: function() {
    console.log("ViewModel:onNavigateFrom");

    this._itemViewModels.forEach(function(itemViewModel) {
      itemViewModel.onNavigateFrom();
    });
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
