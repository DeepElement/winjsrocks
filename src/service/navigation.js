import BaseService from "./base"
import WinJS from "winjs";

export default class extends BaseService {
  constructor(application) {
    super(application);

    this._onNavigatingBinding = this._onNavigating.bind(this);
    this._onNavigatedBinding = this._onNavigated.bind(this);
    this._onNavigateBackMessageBinding = this._onNavigateBackMessage.bind(this);
    this._onBeforeNavigateBinding = this._onBeforeNavigate.bind(this);
    this._onResizedBinding = this._onResized.bind(this);
    this._onPopStateBinding = this._onPopState.bind(this);
    this._onNavigateToMessageBinding = this._onNavigateToMessage.bind(this);
    this._lastNavigationPromise = WinJS.Promise.as();

    // TODO: pull the default element from the app config
    this._element = document.createElement("div");
  }

  load(options, callback) {
    var that = this;
    super.load(options, function(err) {
      if (err)
        return callback(err);

      var messageService = that.application.container.getService("message");
      WinJS.Navigation.addEventListener("navigating",
        that._onNavigatingBinding);
      WinJS.Navigation.addEventListener("navigated",
        that._onNavigatedBinding);
      WinJS.Navigation.addEventListener("beforenavigate",
        that._onBeforeNavigateBinding);
      messageService.register("navigateToMessage", that._onNavigateToMessageBinding);
      messageService.register("navigateBackMessage", that._onNavigateBackMessageBinding);
      window.addEventListener("resize", that._onResizedBinding);
      window.addEventListener("popstate", that._onPopStateBinding);

      return callback();
    });
  }

  _onPopState(event) {
    var messageService = this.application.container.getService("message");
    messageService.send("navigateBackMessage");
  }

  _onNavigateBackMessage(type, args) {
    if (this.viewModel && this.viewModel.overrideBackNavigation) {
      log.info("NavigationService: back navigation cancelled based on current vm getBackNavigationDisabled value");
    }
    args = args || {};
    var steps = args.steps || 1;
    return WinJS.Navigation.back(steps);
  }

  _onNavigateToMessage(type, args) {
    var that = this;
    var viewKey = args.viewKey;
    var state = args.state;
    var viewTemplateUri = config.get("pages:" + viewKey + ":template");
    if (viewTemplateUri) {
      var viewClassDef = that.application.container.getViewDef(viewKey);
      winjsHelper.pageDefine(viewKey, viewTemplateUri, viewClassDef);
      var vmInstance = that.application.container.getViewModel(viewKey);
      vmInstance.setKey(viewKey);
      vmInstance.setData(args.state);

      if (this.viewModel)
        this.viewModel.onNavigateFrom();

      if (window["history"]) {
        window.history.pushState({
          context: state,
          key: viewKey
        }, viewKey, "#" + viewKey);
      }
      WinJS.Navigation.navigate(viewTemplateUri, vmInstance);
    }
  }

  _onBeforeNavigate(args) {
    if (this.viewModel && this.viewModel.overrideBackNavigation) {
      log.info("NavigationService: back navigation cancelled based on current vm getBackNavigationDisabled value");
      args.preventDefault();
    }
  }

  _onNavigating(args) {
    var that = this;
    var messageService = this.application.container.getService("message");
    var newElement = this.createDefaultPageElement();
    this._element.appendChild(newElement);
    this._lastNavigationPromise.cancel();

    function cleanup() {
      if (args.detail.delta == -1) {
        if (that.view)
          that.application.container.delViewInstance(that.view.viewModel.key, that.view);
        if (that.viewModel)
          that.application.container.delViewModelInstance(that.viewModel.key, that.viewModel);

        if (that.view && that.viewModel)
          that.viewModel.dispose();
      }

      if (that._element.childElementCount > 1) {
        var oldElement = that._element.firstElementChild;
        // Cleanup and remove previous element
        if (oldElement.winControl) {

          if (oldElement.winControl.unload) {
            oldElement.winControl.unload();
          }
          oldElement.winControl.dispose();
        }
        oldElement.parentNode.removeChild(oldElement);
        oldElement.innerText = "";
        WinJS.Utilities.disposeSubTree(oldElement);
      }
    }

    // TODO: archive the old view/viewModel
    this._lastNavigationPromise = WinJS.Promise.as().then(cleanup, cleanup).then(function() {
      messageService.send("navigatingMessage", args);
      return WinJS.UI.Pages.render(args.detail.location,
        newElement,
        args.detail.state);
    });
    args.detail.setPromise(this._lastNavigationPromise);
  }

  _onNavigated() {
    var messageService = this.application.container.getService("message");
    messageService.send("navigatedMessage");
    this.viewModel.onNavigateTo();
  }

  _onResized() {
    if (this.view && this.view.updateLayout)
      this.view.updateLayout();
  }

  get rootElement() {
    return this._element;
  }

  createDefaultPageElement() {
    var element = document.createElement("div");
    element.setAttribute("dir", window.getComputedStyle(this._element, null).direction);
    element.style.position = "absolute";
    element.style.width = "100%";
    element.style.height = "100%";
    return element;
  }

  get view() {
    if (this.viewElement && this.viewElement.winControl)
      return this.viewElement.winControl
    return null;
  }

  get viewElement() {
    return this._element.firstElementChild;
  }

  get viewModel() {
    if (this.view) {
      if (this.view.viewModel)
        return this.view.viewModel;
    }
    return null;
  }

  unload() {
    var that = this;
    super.upload(options, function(err) {
      if (err)
        return callback(err);
      var messageService = that.application.container.getService("message");
      WinJS.Navigation.removeEventListener("navigating",
        that._onNavigatingBinding);
      WinJS.Navigation.removeEventListener("navigated",
        that._onNavigatedBinding);
      WinJS.Navigation.removeEventListener("beforenavigate",
        that._onBeforeNavigateBinding);
      messageService.unregister("navigateToMessage", that._onNavigateToMessageBinding);
      messageService.unregister("navigateBackMessage", that._onNavigateBackMessageBinding);
      window.removeEventListener("resize", that._onResizedBinding);
      window.removeEventListener("popstate", that._onPopStateBinding)

      if (that._element)
        WinJS.Utilities.disposeSubTree(that._element);
    });
  }
}
