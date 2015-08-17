var ioc = require("../ioc");

exports.pageDefine = function(viewKey, templateUri, baseClassDef) {
  var existingBaseClass = WinJS.UI.Pages.define(templateUri);
  if (baseClassDef && existingBaseClass != baseClassDef) {
    var extendedClassDef = WinJS.UI.Pages.define(templateUri, {}, baseClassDef);
    ioc.overrideView(viewKey, extendedClassDef);
    return extendedClassDef;
  }
  return existingBaseClass;
};
