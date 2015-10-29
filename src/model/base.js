import Eventable from "../common/eventable";

export default class extends Eventable {
  constructor() {
    super();
  }

  get contentType(){
    return this._contentType;
  }

  set contentType(val){
    this._contentType = val;
    this.notify("contentType");
  }
};
