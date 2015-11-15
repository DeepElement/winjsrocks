import BaseService from "./base"
import WinJS from "winjs";

export default class extends BaseService {
  constructor(application) {
    super(application);

    this._onNavigatingBinding = this._onNavigating.bind(this);
    this._onNavigatedBinding = this._onNavigated.bind(this);
    this._onBeforeNavigateBinding = this._onBeforeNavigate.bind(this);

    this._onResizedBinding = this._onResized.bind(this);
    this._onPopStateBinding = this._onPopState.bind(this);
    this._lastNavigationPromise = WinJS.Promise.as();

    // TODO: pull the default element from the app config
    this._element = document.createElement("div");
  }

  loadComponent(options, callback) {
    var that = this;
    super.loadComponent(options, function(err) {
      if (err)
        return callback(err);

      WinJS.Navigation.addEventListener("navigating",
        that._onNavigatingBinding);
      WinJS.Navigation.addEventListener("navigated",
        that._onNavigatedBinding);
      WinJS.Navigation.addEventListener("beforenavigate",
        that._onBeforeNavigateBinding);

      window.addEventListener("resize", that._onResizedBinding);
      window.addEventListener("popstate", that._onPopStateBinding);

      return callback();
    });
  }

  _onPopState(event) {
    var messageService = this.application.container.getService("message");

    // Manage backstack
    var steps = 0;
    for (var i = WinJS.Navigation.history.backStack.length - 1; i >= 0; i--) {
      var item = WinJS.Navigation.history.backStack[i];
      if (item && item.state && item.state.isModal)
        steps++;
    }

    messageService.send("navigateBackMessage", {
      steps: steps
    });
  }

  onNavigateBackMessage(type, args) {
    var that = this;
    if (this.viewModel && this.viewModel.overrideBackNavigation) {
      log.info("NavigationService: back navigation cancelled based on current vm getBackNavigationDisabled value");
      return;
    }
    args = args || {};
    var steps = args.steps || 1;
    return WinJS.Navigation.back(steps);
  }

  onNavigateToMessage(type, args) {
    var that = this;

    var viewKey = args.viewKey;
    var state = args.state;
    var viewTemplateUri = this.application.configuration.get("pages:" + viewKey + ":template");
    var viewClassDef = that.application.container.getViewDef(viewKey);
    var vmInstance = that.application.container.getViewModel(viewKey);
    if (viewTemplateUri && viewClassDef && vmInstance) {
      vmInstance.key = viewKey;
      vmInstance.data = args.state;

      if (this.viewModel)
        this.viewModel.onNavigateFrom();

      WinJS.Navigation.navigate(viewTemplateUri, vmInstance);
    }
  }

  _onBeforeNavigate(args) {
    if (this.viewModel && this.viewModel.overrideBackNavigation) {
      log.info("NavigationService: back navigation cancelled based on current vm getBackNavigationDisabled value");
      args.preventDefault();
    }
  }

  /*
    Called on both Forward and Back navigation
  */
  _onNavigating(args) {
    var that = this;
    args.detail.delta = args.detail.delta || 0;
    var messageService = this.application.container.getService("message");
    var newElement = this.createDefaultPageElement();
    this._element.appendChild(newElement);
    this._lastNavigationPromise.cancel();

    function cleanup() {
      if (args.detail.delta < 0) {
        if (that.view)
          that.application.container.delViewInstance(that.view.viewModel.key, that.view);
        if (that.viewModel) {
          that.application.container.delViewModelInstance(that.viewModel.key, that.viewModel);
        }

        if (that.view && that.viewModel)
          that.viewModel.dispose();
      }
      if (that._element.childElementCount > 1) {

        var oldElement = that._element.firstElementChild;

        // Cleanup and remove previous element
        if (oldElement.winControl) {
          oldElement.winControl.dispose();
        }
        oldElement.parentNode.removeChild(oldElement);
        oldElement.innerText = "";

        WinJS.Utilities.disposeSubTree(oldElement);
      }
    };

    var afterRender = function(err) {

      if (args.detail.delta >= 0) {

        // Push the new view on state if last view is not modal
        var lastNavigationItem = WinJS.Navigation.history.backStack[WinJS.Navigation.history.backStack.length - 1];
        if (lastNavigationItem && lastNavigationItem.state && !lastNavigationItem.state.isModal) {
          window.history.pushState(args.detail.state.key, args.detail.state.key, "#" + args.detail.state.key)
        } else {
          // Update most recent history entry
          window.history.replaceState(args.detail.state.key, args.detail.state.key, "#" + args.detail.state.key)
          WinJS.Navigation.history.backStack.splice(-1, 1);
        }
      }

      //console.log(err);
      if (err)
        messageService.send("applicationErrorMessage", err);
    };

    // TODO: archive the old view/viewModel
    this._lastNavigationPromise = WinJS.Promise.as().then(cleanup, cleanup).then(function() {
      messageService.send("navigatingMessage", args);
      return WinJS.UI.Pages.render(args.detail.location,
        newElement,
        args.detail.state).then(afterRender, afterRender)
    });
    args.detail.setPromise(this._lastNavigationPromise);
  }

  _onNavigated(args) {
    var that = this;
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

  unloadComponent(options, callback) {
    var that = this;
    super.unloadComponent(options, function(err) {
      if (err)
        return callback(err);

      WinJS.Navigation.removeEventListener("navigating",
        that._onNavigatingBinding);
      WinJS.Navigation.removeEventListener("navigated",
        that._onNavigatedBinding);
      WinJS.Navigation.removeEventListener("beforenavigate",
        that._onBeforeNavigateBinding);

      window.removeEventListener("resize", that._onResizedBinding);
      window.removeEventListener("popstate", that._onPopStateBinding)

      if (that._element)
        WinJS.Utilities.disposeSubTree(that._element);

      return callback();
    });
  }
}
