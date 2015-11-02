import Loadable from "../common/loadable";

export default class extends Loadable {
  constructor(application, key, type) {
    super(application);
    var validTypes = ['service', 'provider', 'runtime'];
    type = type || 'runtime';
    if (!key)
      throw new Error("Key is required for a plugin.");
    if (!type)
      throw new Error("Type is required for a Plugin. Valid values are 'service', 'provider', 'runtime'");
    this._key = key;
    this._pluginType = type;
  }

  get key() {
    return this._key;
  }

  get type() {
    return this._pluginType;
  }

  loadComponent(options, callback) {
    var that = this;

    // register self
    switch (that.type) {
      case "provider":
        // TODO: register self instance as a provider
        that.application.container.registerProvider(that.key, that.constructor, "request");
        that.application.container.addInstance(that.key, this);
        break;
      case "service":
        // TODO: register self instance as a service
        that.application.container.registerService(that.key, that.constructor, "application");
        that.application.container.addInstance(that.key, this);
        break;
    }

    return super.loadComponent(options, callback);
  }
};
