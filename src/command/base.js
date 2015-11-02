import Eventable from "../common/eventable";

export default class extends Eventable {
  constructor(payload) {
    super();
    this._internalExecute = payload || function() {};
  }

  execute(args) {
    if (this.canExecute) {
      return this._internalExecute.apply(this, arguments);
    }
    return null;
  }

  get canExecute() {
    return this._canExecute;
  }
}
