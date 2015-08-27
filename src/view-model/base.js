var WinJS = require('winjs'),
  ioc = require('../ioc'),
  mixins = require('../helper/mixins'),
  log = require('../log');

var _constructor = function(options) {
  var that = this;
  this._loadingState = "loading";
  this._itemViewModels = [];

  ioc.getServiceKeys().forEach(function(key) {
    var apiKey = key.capitalizeFirstLetter() + "Service";
    Object.defineProperty(that, apiKey, {
      value: ioc.getService(key),
      writable: false,
      configurable: false,
      enumerable: false
    });
  });

  this._initialLoadTimerId = this.ApplicationService.setTimeout(function() {
    if (that._loadingState != "loaded")
      that.MessageService.send("viewLoadTimeoutMessage", this.key);
    that.ApplicationService.clearTimeout(this._initialLoadTimerId);
  }, 10000);
};

var instanceMembers = {
  addManagedEventListener: function(subject, property, handler) {
    if (subject && property && handler) {
      var binding = handler.bind(this);
      this._managedEvents = this._managedEvents || [];
      this._managedEvents.push({
        subject: subject,
        property: property,
        handler: handler,
        binding: binding
      });
      subject.addEventListener(property, binding);
    }
  },

  _super: {
    get: function() {
      return Object.getPrototypeOf(this);
    }
  },

  addItemViewModels: function(models) {
    var that = this;
    var results = [];
    models.forEach(function(model) {
      results.push(that.addItemViewModel(model));
    });
    return results;
  },

  addItemViewModel: function(model) {
    var itemViewModel = ioc.getItemViewModel(model.getContentType().toLowerCase());
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
    return WinJS.Promise.as();
  },

  getData: function() {
    return this._data;
  },

  setData: function(val) {
    var that = this;
    that._data = val;
    that.notifyLoading();
    that.notify('data');
    WinJS.Promise.as(that.onDataSet()).done(function() {
      that.notifyLoaded();
    })
  },

  onNavigateTo: function() {
    this._itemViewModels.forEach(function(itemViewModel) {
      itemViewModel.onNavigateTo();
    });
  },

  onNavigateFrom: function() {

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
  },

  dispose: function(){
    this._itemViewModels.forEach(function(itemViewModel) {
      itemViewModel.onNavigateFrom();
      ioc.delItemViewInstance(itemViewModel.getItem().getContentType().toLowerCase(), itemViewModel);
    });

    this.removeAllManagedEventListeners();

    for (var member in this) delete this[member];
  }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
  instanceMembers, staticMembers);
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
WinJS.Class.mix(module.exports, mixins.autoProperty);
WinJS.Class.mix(module.exports, mixins.managedEvents);
