export default class {
  constructor() {
    WinJS.Class.mix(this, WinJS.Utilities.eventMixin);
  }

  notify(eventName) {
    this.dispatchEvent(eventName, this[eventName]);
  }
};
