var WinJS = require('winjs'),
  ioc = require('../ioc'),
  config = require('../config'),
  base = require('./base'),
  log = require('../log'),
  winjsHelper = require("../helper/winjs");

var _constructor = function(options) {
  base.call(this, arguments);
  this._onNavigatingBinding = this._onNavigating.bind(this);
  this._onNavigatedBinding = this._onNavigated.bind(this);
  this._onNavigateBackMessageBinding = this._onNavigateBackMessage.bind(this);
  this._onBeforeNavigateBinding = this._onBeforeNavigate.bind(this);
  this._onResizedBinding = this._onResized.bind(this);
  this._onPopStateBinding = this._onPopState.bind(this);
  this._onNavigateToMessageBinding = this._onNavigateToMessage.bind(this);
  this._lastNavigationPromise = WinJS.Promise.as();
  this.MessageService = ioc.getService("message");
  this._element = document.createElement("div");
};

var instanceMembers = {
  start: function() {
    var that = this;
    return base.prototype.start.apply(this, arguments).then(function() {
      WinJS.Navigation.addEventListener("navigating",
        that._onNavigatingBinding);
      WinJS.Navigation.addEventListener("navigated",
        that._onNavigatedBinding);
      WinJS.Navigation.addEventListener("beforenavigate",
        that._onBeforeNavigateBinding);
      that.MessageService.register("navigateToMessage", that._onNavigateToMessageBinding);
      that.MessageService.register("navigateBackMessage", that._onNavigateBackMessageBinding);
      window.addEventListener("resize", that._onResizedBinding);
      window.addEventListener("popstate", that._onPopStateBinding);
    });
  },

  _onPopState: function(event) {
    this.MessageService.send("navigateBackMessage");
  },

  _onNavigateBackMessage: function(type, args) {
    if (this.getViewModel() && this.getViewModel().getBackNavigationDisabled()) {
      log.info("NavigationService: back navigation cancelled based on current vm getBackNavigationDisabled value");
    }
    args = args || {};
    var steps = args.steps || 1;
    return WinJS.Navigation.back(steps);
  },

  _onNavigateToMessage: function(type, args) {
    var viewKey = args.viewKey;
    var state = args.state;
    var viewTemplateUri = config.get("pages:" + viewKey + ":template");
    if (viewTemplateUri) {
      var viewClassDef = ioc.getViewDef(viewKey);
      winjsHelper.pageDefine(viewKey, viewTemplateUri, viewClassDef);
      var vmInstance = ioc.getViewModel(viewKey);
      vmInstance.setKey(viewKey);
      vmInstance.setData(args.state);

      if (this.getViewModel())
        this.getViewModel().onNavigateFrom();

      if (window["history"]) {
        window.history.pushState({
          context: state,
          key: viewKey
        }, viewKey, "#" + viewKey);
      }
      WinJS.Navigation.navigate(viewTemplateUri, vmInstance);
    }
  },

  _onBeforeNavigate: function(args) {
    if (this.getViewModel() && this.getViewModel().getBackNavigationDisabled()) {
      log.info("NavigationService: back navigation cancelled based on current vm getBackNavigationDisabled value");
      args.preventDefault();
    }
  },

  _onNavigating: function(args) {
    var that = this;
    var newElement = this.createDefaultPageElement();
    this._element.appendChild(newElement);
    this._lastNavigationPromise.cancel();

    function cleanup() {
      if (that._element && that._element.wincontrol && that._element.wincontrol.getViewModel())
        that._element.wincontrol.getViewModel().dispose();

      if (args.detail.delta == -1) {
        if (that.getView())
          ioc.delViewInstance(that.getView().getViewModel().getKey(), that.getView());
        if (that.getViewModel())
          ioc.delViewModelInstance(that.getViewModel().getKey(), that.getViewModel());
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
      that.MessageService.send("navigatingMessage", args);
      return WinJS.UI.Pages.render(args.detail.location,
        newElement,
        args.detail.state);
    });
    args.detail.setPromise(this._lastNavigationPromise);
  },

  _onNavigated: function() {
    this.MessageService.send("navigatedMessage");
    this.getViewModel().onNavigateTo();
  },

  _onResized: function() {
    var view = this.getView();
    if (view && view.updateLayout)
      view.updateLayout();
  },

  getRootElement: function() {
    return this._element;
  },

  setRootElement: function(val) {
    this._element = val;
  },

  createDefaultPageElement: function() {
    var element = document.createElement("div");
    element.setAttribute("dir", window.getComputedStyle(this._element, null).direction);
    element.style.position = "absolute";
    element.style.width = "100%";
    element.style.height = "100%";
    return element;
  },

  getView: function() {
    var viewElem = this.getViewElement();
    if (viewElem && viewElem.winControl)
      return viewElem.winControl
    return null;
  },

  getViewElement: function() {
    return this._element.firstElementChild;
  },

  getViewModel: function() {
    var view = this.getView();
    if (view) {
      var viewModel = view.getViewModel();
      if (viewModel)
        return viewModel;
    }
    return null;
  },

  stop: function() {
    var that = this;
    return base.prototype.start.apply(this, arguments)
      .then(function() {
        WinJS.Navigation.removeEventListener("navigating",
          that._onNavigatingBinding);
        WinJS.Navigation.removeEventListener("navigated",
          that._onNavigatedBinding);
        WinJS.Navigation.removeEventListener("beforenavigate",
          that._onBeforeNavigateBinding);
        that.MessageService.unregister("navigateToMessage", that._onNavigateToMessageBinding);
        that.MessageService.unregister("navigateBackMessage", that._onNavigateBackMessageBinding);
        window.removeEventListener("resize", that._onResizedBinding);
        window.removeEventListener("popstate", that._onPopStateBinding)

        if (this._element)
          WinJS.Utilities.disposeSubTree(this._element);
      });
  }
};

var staticMembers = {

};

module.exports = WinJS.Class.derive(base, _constructor,
  instanceMembers, staticMembers);
