var ioc = require("../ioc"),
  WinJS = require('winjs');

exports.pageDefine = function(viewKey, templateUri, baseClassDef) {
  var existingBaseClass = WinJS.UI.Pages.define(templateUri);
  if (baseClassDef && existingBaseClass != baseClassDef) {
    var extendedClassDef = WinJS.UI.Pages.define(templateUri, {}, baseClassDef);
    ioc.overrideView(viewKey, extendedClassDef);
    return extendedClassDef;
  }
  return existingBaseClass;
};

exports.markForProcessing = function(subject) {
  var _self = this;
  for (var _property in subject)
    if (subject.hasOwnProperty(_property)) {
      if (typeof subject[_property] == "object" && _property[0] != "_") {
        exports.markForProcessing(subject[_property]);
      } else
      if (subject[_property] instanceof Function && !subject[_property]["supportedForProcessing"]) {
        WinJS.Utilities.markSupportedForProcessing(subject[_property]);
      }
    }
};
