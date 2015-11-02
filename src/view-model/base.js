import Component from "../common/component";
import StringHelper from "../helper/string";
import CommandBase from "../command/base";

export default class extends Component {
  constructor(application) {
    super(application);
    var that = this;

    this._loadingState = "loading";
    this._itemViewModels = [];

    this.application.container.getServiceKeys().forEach(function(key) {
      var apiKey = StringHelper.capitalizeFirstLetter(key) + "Service";
      Object.defineProperty(that, apiKey, {
        value: that.application.container.getService(key),
        writable: false,
        configurable: false,
        enumerable: false
      });
    });

    this._initialLoadTimerId = this.ApplicationService.setTimeout(function() {
      if (that._loadingState != "loaded")
        that.MessageService.send("viewLoadTimeoutMessage", that.key);
      that.ApplicationService.clearTimeout(that._initialLoadTimerId);
    }, 10000);
  }

  addItemViewModels(models) {
    var that = this;
    var results = [];
    models.forEach(function(model) {
      results.push(that.addItemViewModel(model));
    });
    return results;
  }

  addItemViewModel(model) {
    var itemViewModel = this.application.container.getItemViewModel(model.getContentType().toLowerCase());
    if (itemViewModel) {
      itemViewModel.setData(model);
      this._itemViewModels.push(itemViewModel);
      this.notify("itemViewModels");
      return itemViewModel;
    }
    log.warn("ItemViewModel for " + model.getContentType() + " not found");
    return null;
  }

  removeItemViewModel(instance) {
    var instanceIdx = this._itemViewModels.indexOf(instance);
    if (instanceIdx > -1) {
      this._itemViewModels.slice(instanceIdx, 1);
      this.notify("itemViewModels");
      return true;
    }
    return false;
  }

  get itemViewModels() {
    return this._itemViewModels;
  }

  get overrideBackNavigation() {
    return this._overrideBackNavigation || false;
  }

  set overrideBackNavigation(val) {
    this._overrideBackNavigation = val;
    this.notify("overrideBackNavigation");
  }

  get key() {
    return this._key;
  }

  set key(val) {
    this._key = val;
    this.notify("key");
  }

  onDataSet(callback) {
    return callback();
  }

  get data() {
    return this._data;
  }

  set data(val) {
    var that = this;
    that._data = val;
    that.notifyLoading();
    that.notify('data');
    that.onDataSet(function() {
      that.notifyLoaded();
    });
  }

  onNavigateTo() {
    this._itemViewModels.forEach(function(itemViewModel) {
      itemViewModel.onNavigateTo();
    });
  }

  onNavigateFrom() {
    this._itemViewModels.forEach(function(itemViewModel) {
      itemViewModel.onNavigateFrom();
    });
  }

  get loadingState() {
    return this._loadingState;
  }

  notifyLoading() {
    this._loadingState = "loading";
    this.notify("loadingState");
  }

  notifyLoaded() {
    this._loadingState = "loaded";
    this.notify("loadingState");
  }

  dispose() {
    var that = this;
    this._itemViewModels.forEach(function(itemViewModel) {
      itemViewModel.onNavigateFrom();
      that.application.container.delItemViewModelInstance(itemViewModel.getItem().getContentType().toLowerCase(), itemViewModel);
    });

    this.removeAllManagedEventListeners();
  }
};
