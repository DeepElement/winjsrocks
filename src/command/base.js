import Eventable from "../common/eventable";

export default class extends Eventable {
  constructor(payload, key) {
    super();
    this._key = key;
    this._internalExecute = payload || function() {};
  }

  execute() {
    return this._internalExecute.apply(this, arguments);
  }

  get canExecute() {
    return this._canExecute;
  }
}
