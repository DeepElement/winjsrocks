import Loadable from "./loadable";

export default class extends Loadable {
  constructor() {
    super();
  }

  pause(options, callback) {
    return callback();
  }

  resume(options, callback) {
    return callback();
  }
};
