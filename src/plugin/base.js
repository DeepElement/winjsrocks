import LifeCycle from "../common/lifecycle"

export default class extends LifeCycle {
  constructor(application) {
    super(application);
  }

  setup(options, callback) {
    if (callback)
      return callback();
  }


  loadComponent(options, callback) {
    return super.loadComponent(options, callback);
  }
};
