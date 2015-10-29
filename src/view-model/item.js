import BaseViewModel from "./base";

export default class extends BaseViewModel {
  constructor(application) {
    super(application);
  }

  get item() {
    return this.getData();
  }
};
