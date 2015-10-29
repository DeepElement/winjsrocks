export default class {
  constructor(application) {
    this._application = application;
    WinJS.Class.mix(this, WinJS.Utilities.eventMixin);
  }

  get application() {
    return this._application;
  }

  notify(eventName) {
    this.dispatchEvent(eventName, this[eventName]);
  }
};
