import LifeCycle from "../common/lifecycle"

export default class extends LifeCycle {
  constructor(application) {
    super(application);
  }

  setup(options, callback) {
    return callback();
  }
};
