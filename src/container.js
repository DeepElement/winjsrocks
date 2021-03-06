import Momentr from "momentr";
import StringHelper from "./helper/string";

var _validScopes = ["request", "application"];
var exportsConfig = [{
  type: "itemViewModel",
  prefix: "itemViewModel_",
  scope: "request"
}, {
  type: "viewModel",
  prefix: "viewModel_",
  scope: "request"
}, {
  type: "provider",
  prefix: "provider_",
  scope: "request"
}, {
  type: "service",
  prefix: "service_",
  scope: "application"
}, {
  type: "itemModel",
  prefix: "itemModel_",
  scope: "request"
}, {
  type: "view",
  prefix: "view_",
  scope: "request"
}, {
  type: "itemView",
  prefix: "itemView_",
  scope: "request"
}, {
  type: "plugin",
  prefix: "plugin_",
  scope: "application"
}];

export default class {
  constructor(application) {
    var that = this;

    this._application = application;
    this._momentr = new Momentr();

    exportsConfig.forEach(function(config) {
      var caseType = StringHelper.capitalizeFirstLetter(config.type);
      that["get" + caseType + "Keys"] = function() {
        var keys = this._momentr.getRegisteredKeys();
        return keys.filter(function(f) {
          return f.indexOf(config.prefix) == 0;
        }).map(function(f) {
          return f.substr(config.prefix.length);
        });
      };

      that["get" + caseType] = function(key, ...args) {
        var containerKey = config.prefix + key;
        if (that._momentr.def(containerKey)) {
          var getArgs = [that._application, ...args];
          return that._momentr.get(config.prefix + key, ...getArgs);
        }
        return null;
      };

      that["override" + caseType] = function(key, classDef) {
        return that._momentr.override(config.prefix + key, classDef);
      };

      that["get" + caseType + "Def"] = function(key) {
        var subject = that._momentr.def(config.prefix + key);
        if (subject)
          return subject.type;
        return null;
      };

      that["is" + caseType + "Registered"] = function(key) {
        return that._momentr.def(config.prefix + key) != null;
      };

      that["register" + caseType] = function(key, clazz) {
        return that._momentr.register(config.prefix + key, clazz, config.scope);
      };

      that["del" + caseType + "Instance"] = function(key, instance) {
        return that._momentr.del(config.prefix + key, instance);
      };
    });
  }

  getRegisteredKeys() {
    return this._momentr.getRegisteredKeys();
  };

  getRegisteredKeys() {
    return this._momentr.getRegisteredKeys();
  };

  addInstance(key, instance) {
    return this._momentr.addInstance(key, instance);
  };

  getAllInstances() {
    return this._momentr.getAllInstances();
  };

  get(key) {
    return this._momentr.get(key, this.application);
  };

  clear() {
    return this._momentr.clear();
  };

  override(key, clazz) {
    return this._momentr.override(key, clazz);
  }
};
