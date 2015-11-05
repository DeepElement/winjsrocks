import BaseViewModel from "./base";

export default class extends BaseViewModel {
  constructor(application, parentViewModel) {
    super(application);
    this._parentViewModel = parentViewModel;
  }

  get item() {
    return this.data;
  }

  get parentViewModel() {
    return this._parentViewModel;
  }
};
