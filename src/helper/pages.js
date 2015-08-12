
/*
  This method 'crams' the View base class into the WinJS.Pages api
  Recommendations on improving at https://github.com/winjs/winjs/issues/1343
*/
exports.define = function(template, viewClassDef) {
    var pageClassDef = WinJS.UI.Pages.define(template);
    viewClassDef.prototype._super = pageClassDef;
    var pageClassDeriveDef = WinJS.Class.derive(pageClassDef,
      viewClassDef, viewClassDef.prototype);
    WinJS.UI.Pages._viewMap[template] = pageClassDeriveDef;
    return pageClassDeriveDef;
};
