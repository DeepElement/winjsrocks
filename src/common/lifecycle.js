import Loadable from "./loadable";

export default class extends Loadable {
  constructor(application) {
    super(application);
  }

  pause(options, callback) {
    return callback();
  }

  resume(options, callback) {
    return callback();
  }
};
