var WinJS = require('winjs');

/*
  This method 'crams' the View base class into the WinJS.Pages api
  Recommendations on improving at https://github.com/winjs/winjs/issues/1343
*/
exports.define = function(template, viewClassDef) {

  function abs(uri) {
    var a = document.createElement("a");
    a.href = uri;
    return a.href;
  };

  var absTemplateUri = abs(template);
  var pageClassDef = WinJS.UI.Pages.define(absTemplateUri);
  viewClassDef.prototype._super = pageClassDef;
  var pageClassDeriveDef = WinJS.Class.derive(pageClassDef,
    viewClassDef, viewClassDef.prototype);
  WinJS.UI.Pages._viewMap[absTemplateUri] = pageClassDeriveDef;
  return pageClassDeriveDef;
};
