import LifeCycle from "../common/lifecycle"

export default class extends LifeCycle {
  constructor(application, key) {
    super(application);
    if (!key)
      throw new Error("Key is required for a plugin.");
    this._key = key;
  }

  get key() {
    return this._key;
  }

  setup(options, callback) {
    if (callback)
      return callback();
  }


  loadComponent(options, callback) {
    return super.loadComponent(options, callback);
  }
};
