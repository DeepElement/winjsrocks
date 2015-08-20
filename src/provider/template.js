var WinJS = require('winjs'),
  base = require('./base'),
  ioc = require('../ioc'),
  config = require('../config'),
  winjsHelper = require('../helper/winjs');

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
      var viewTemplateUri = config.get("domain:" + viewKey + ":template");
      WinJS.Utilities.addClass(mediaTile, "item-template-" + viewKey);
      var viewClassDef = ioc.getItemViewDef(viewKey);
      winjsHelper.pageDefine(viewKey, viewTemplateUri, viewClassDef);
      return WinJS.UI.Pages.render(viewTemplateUri, mediaTile, itemViewModel);
    });
    winjsHelper.markForProcessing(this);
    return {
      element: mediaTile,
      renderComplete: _renderCompletePromise
    };
  }
};

module.exports = WinJS.Class.derive(base,
  _constructor, instanceMembers);
