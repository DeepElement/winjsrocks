import WinJS from "winjs";

export default class WinJSHelper {
  static markForProcessing(subject) {
    var _self = this;

    for (var _property in subject)
      if (subject.hasOwnProperty(_property)) {
        if (typeof subject[_property] == "object" && _property[0] != "_") {
          WinJSHelper.markForProcessing(subject[_property]);
        } else
        if (subject[_property] instanceof Function && !subject[_property]["supportedForProcessing"]) {
          WinJS.Utilities.markSupportedForProcessing(subject[_property]);
        }
      }
  }
}
