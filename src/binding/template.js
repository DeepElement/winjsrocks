var WinJS = require('winjs'),
  ioc = require('../ioc'),
  config = require('../config'),
  winjsHelper = require('../helper/winjs');

exports.itemTemplateSelector = function(itemPromise) {
  var mediaTile = document.createElement("div");
  WinJS.Utilities.addClass(mediaTile, "item-template");
  var _renderCompletePromise = itemPromise.then(function(item) {
    var itemViewModel = item instanceof Array? item[0].data : item.data;
    var viewKey = itemViewModel.getItem().getContentType().toLowerCase();
    var viewTemplateUri = config.get("domain:" + viewKey + ":template");
    WinJS.Utilities.addClass(mediaTile, "item-template-" + viewKey);
    var viewClassDef = ioc.getItemViewDef(viewKey);
    winjsHelper.pageDefine(viewKey, viewTemplateUri, viewClassDef);
    return WinJS.UI.Pages.render(viewTemplateUri, mediaTile, itemViewModel);
  });
  return {
    element: mediaTile,
    renderComplete: _renderCompletePromise
  };
};
