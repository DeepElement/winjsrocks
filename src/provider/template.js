var WinJS = require('winjs'),
  base = require('./base'),
  ioc = require('../ioc'),
  config = require('../config'),
  util = require("util");

var _constructor = function(options) {
  base.call(this, arguments);
};

var instanceMembers = {
  itemTemplateSelector: function(itemPromise) {
    var mediaTile = document.createElement("div");
    WinJS.Utilities.addClass(mediaTile, "item-template");
    var _renderCompletePromise = itemPromise.then(function(item) {
      var itemViewModel = item.data;
      var viewKey = itemViewModel.getItem().getContentType().toLowerCase();
      WinJS.Utilities.addClass(mediaTile, "item-template-" + viewKey);
      var viewTemplateUri = config.get("ui:item-view:template-uri");
      var actualViewTemplateUri = util.format(viewTemplateUri, viewKey);
      var viewClassDef = ioc.getItemViewDef(viewKey);
      var extendedClassDef = WinJS.UI.Pages.define(actualViewTemplateUri, {}, viewClassDef);
      ioc.override(viewKey, extendedClassDef);
      return WinJS.UI.Pages.render(actualViewTemplateUri, mediaTile, itemViewModel);
    });
    return {
      element: mediaTile,
      renderComplete: _renderCompletePromise
    };
  }
};

module.exports = WinJS.Class.derive(base,
  _constructor, instanceMembers);
