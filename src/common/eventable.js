import WinJS from "winjs";

var classDef = class {
  constructor() {
  }

  notify(eventName) {
    this.dispatchEvent(eventName, this[eventName]);
  }
};

WinJS.Class.mix(classDef, WinJS.Utilities.eventMixin);
export default classDef;
