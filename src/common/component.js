import Eventable from "./eventable";

export default class extends Eventable {
  constructor(application) {
    super();
    this._application = application;
  }

  get application() {
    return this._application;
  }
};
