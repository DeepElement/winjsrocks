import Eventable from "../common/eventable";

export default class extends Eventable {
  constructor(payload) {
    super();
    var that = this;
    this.execute = function() {
      var executor = payload || function() {};
      if (that.canExecute)
        return executor.apply(that, arguments);
      return null;
    }
    this._canExecute = true;
  }

  get canExecute() {
    return this._canExecute;
  }

  set canExecute(val) {
    this._canExecute = true;
    this.notify("canExecute");
  }
}
