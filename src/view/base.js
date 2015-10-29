import Loadable from "../common/loadable";
import WinJSHelper from "../helper/winjs";

export default class extends Loadable {
  constructor(element, viewModel) {
    super(viewModel.application);
  }

  get viewModel() {
    return this._viewModel;
  }

  get data() {
    if (this.viewModel)
      return this.viewModel.data;
    return null;
  }

  /*************************************
    WINJS Page Overrides
  **************************************/
  load(uri) {
    var that = this;
    return this._winjsPagePrototype.prototype.load.apply(this, arguments).then(new WinJS.Promise(function(completed, error) {
      // Add any custom logic here
      return completed();
    }));
  }

  init(element, options) {
    var that = this;
    this.addManagedEventListener(this.viewModel, "loadingState", this._onLoadingStateChanged);
    return this._winjsPagePrototype.prototype.init.apply(this, arguments).then(new WinJS.Promise(function(completed, error) {
      // Add any custom logic here
      return completed();
    }));
  }


  render(element, options, loadResult) {
    var that = this;
    return this._winjsPagePrototype.prototype.render.apply(this, arguments).then(
      new WinJS.Promise(function(completed, error) {
        // Add any custom logic here
        return completed();
      }));
  }

  // No return value on purpose
  dispose() {
    var that = this;
    super.unload({}, function() {
      if (that.element)
        WinJS.Utilities.disposeSubTree(that.element);
      that.viewModel = null;
    });
  }

  process(element, options) {
    var that = this;
    return this._winjsPagePrototype.prototype.process.apply(this, arguments).then(
      new WinJS.Promise(function(completed, error) {
        // Add any custom logic here
        return completed();
      }));
  }

  processed(element, options) {
    var that = this;
    return this._winjsPagePrototype.prototype.processed.apply(this, arguments).then(
      new WinJS.Promise(function(completed, error) {
        if (that.viewModel.getLoadingState() == "loading") {
          var callbackDelegate = function() {
            if (that.viewModel.getLoadingState() == "loaded") {
              that.viewModel.removeEventListener("loadingState", callbackDelegate);
              return complete();
            }
          };
          that.viewModel.addEventListener("loadingState", callbackDelegate);
        } else {
          return complete();
        }
      })).then(function() {
      return that._onLoadingStateChanged();
    });
  }

  ready(element, options) {
    var that = this;
    return this._winjsPagePrototype.prototype.ready.apply(this, arguments).then(
      new WinJS.Promise(function(completed, error) {
        // Add any custom logic here
        return completed();
      }));
  }

  error(err) {
    var that = this;
    // TODO: replace with viewModel.onViewErrorCommand
    return this._winjsPagePrototype.prototype.error.apply(this, arguments).then(
      new WinJS.Promise(function(completed, error) {
        var messageService = that.application.container.getService("message");
        messageService.send("viewErrorMessage", err);

        return completed();
      }));
  }

  updateLayout() {

  }

  update() {
    var that = this;
    var appService = this.application.container.getService("application");
    WinJSHelper.markForProcessing(that.viewModel);
    return WinJS.UI.processAll(that.element).then(function() {
      return WinJS.Binding.processAll(that.element, that.viewModel).then(function() {
        return WinJS.Resources.processAll(that.element);
      });
    });
  }

  _onLoadingStateChanged() {
    if (this.viewModel.getLoadingState() == "loaded") {
      return this.update();
    }
    return WinJS.Promise.as();
  }
}
