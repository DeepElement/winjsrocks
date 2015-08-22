var WinJS = require('winjs'),
  mixins = require('../helper/mixins'),
  winjsHelper = require('../helper/winjs');

var _constructor = function(element, options) {
  var that = this;
  this._viewModel = options;
  this._super.apply(this, arguments);
  this._managedEvents = [];
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

  update: function() {
    winjsHelper.markForProcessing(this.getViewModel());
    WinJS.UI.processAll(this.element);
    WinJS.Binding.processAll(this.element, this.getViewModel());
    WinJS.Resources.processAll(this.element);
  },

  _onLoadingStateChanged: function() {
    if (this.getViewModel().getLoadingState() == "loaded") {
      this.update();
    }
  },

  getData: function() {
    if (this._viewModel)
      return this._viewModel.data;
    return null;
  },

  render: function(element, options, loadResult) {
    return this._super.prototype.render.apply(this, arguments);
  },

  init: function(element, options) {
    this.addManagedEventListener(this.getViewModel(), "loadingState", this._onLoadingStateChanged);
    return this._super.prototype.init.apply(this, arguments);
  },

  dispose: function() {
    var result = this._super.prototype.dispose.apply(this, arguments);
    if (this._managedEvents) {
      this._managedEvents.forEach(function(ctx) {
        if (ctx.subject && ctx.property && ctx.binding)
          ctx.subject.removeEventListener(ctx.property, ctx.binding);
      });
      this._managedEvents = null;
    }
    if (this.element)
      WinJS.Utilities.disposeSubTree(this.element);
    return result;
  },

  processed: function(element, options) {
    var that = this;
    return new WinJS.Promise(function(complete, error, progress) {
      if (that._viewModel.getLoadingState() == "loading") {
        var callbackDelegate = function() {
          if (that._viewModel.getLoadingState() == "loaded") {
            that._viewModel.removeEventListener("loadingState", callbackDelegate);
            return complete();
          }
        };
        that._viewModel.addEventListener("loadingState", callbackDelegate);
      } else {
        return complete();
      }
    }).then(function() {
      that._onLoadingStateChanged();
    });
  },

  ready: function() {
    this._super.prototype.ready.apply(this, arguments);
  },

  getAnimationElements: function() {
    return [];
  },

  getViewModel: function() {
    return this._viewModel;
  },

  /* Generally called on Window Resize */
  updateLayout: function() {

  },

  error: function(err) {
    var messageService = WinJS.ioc.getService("message");
    messageService.send("viewErrorMessage", err);
  }
};

var staticMembers = {

};

module.exports = WinJS.Class.define(_constructor,
  instanceMembers, staticMembers);
WinJS.Class.mix(module.exports, WinJS.Utilities.eventMixin);
WinJS.Class.mix(module.exports, mixins.notify);
