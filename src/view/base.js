import Loadable from "../common/loadable";
import WinJSHelper from "../helper/winjs";
import WinJS from "winjs";

export default class extends Loadable {
  constructor(element, viewModel, complete, parentedPromise) {
    super(viewModel.application);
    this._winjsPage.apply(this, arguments);
    this._viewModel = viewModel;
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

  // returns promise or nothing
  load(uri) {
    var that = this;
    return WinJS.Promise.as(this._winjsPage.prototype.load.apply(this, arguments));
  }

  // returns promise or nothing
  init(element, options) {
    var that = this;
    this.addManagedEventListener(this.viewModel, "loadingState", this._onLoadingStateChanged);
    return WinJS.Promise.as(this._winjsPage.prototype.init.apply(this, arguments));
  }

  // returns promise or nothing
  render(element, options, loadResult) {
    var that = this;
    return WinJS.Promise.as(this._winjsPage.prototype.render.apply(this, arguments)).then(function() {
      return new WinJS.Promise(function(complete, error, progress) {
        return complete();
      });
    });
  }

  // returns nothing
  dispose() {
    var that = this;
    super.unloadComponent({}, function() {
      if (that.element)
        WinJS.Utilities.disposeSubTree(that.element);
    });
  }

  // returns promise
  process(element, options) {
    var that = this;
    return WinJS.Promise.as(this._winjsPage.prototype.process.apply(this, arguments));
  }

  // returns promise or nothing
  processed(element, options) {
    var that = this;

    return new WinJS.Promise(function(complete, error, progress) {
      if (that.viewModel.loadingState == "loading") {
        var callbackDelegate = function() {
          if (that.viewModel.loadingState == "loaded") {
            that.viewModel.removeEventListener("loadingState", callbackDelegate);
            return complete();
          }
        };
        that.viewModel.addEventListener("loadingState", callbackDelegate);
      } else {
        return complete();
      }
    }).then(function() {
      return that._onLoadingStateChanged();
    });
  }

  // returns nothing
  ready(element, options) {
    var that = this;
    this._winjsPage.prototype.ready.apply(this, arguments);
    return;
  }

  // returns nothing or error promise
  error(err) {
    var that = this;
    // TODO: replace with viewModel.onViewErrorCommand
    return WinJS.Promise.as(this._winjsPage.prototype.error.apply(this, arguments)).then(function() {
      return new WinJS.Promise(function(completed, error) {
        var messageService = that.application.container.getService("message");
        messageService.send("viewErrorMessage", err);

        return completed();
      });
    });
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
    if (this.viewModel.loadingState == "loaded") {
      return this.update();
    }
    return WinJS.Promise.as();
  }
}
