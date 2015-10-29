import Momentr from "momentr";
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
}];

export default class {
  constructor(application) {
    var that = this;
    this._application = application;
    this._momentr = new Momentr();

    exportsConfig.forEach(function(config) {
      var caseType = config.type.capitalizeFirstLetter();
      that["get" + caseType + "Keys"] = function() {
        var keys = this._momentr.getRegisteredKeys();
        return keys.filter(function(f) {
          return f.indexOf(config.prefix) == 0;
        }).map(function(f) {
          return f.substr(config.prefix.length);
        });
      };

      that["get" + caseType] = function(key) {
        var result = that._momentr.get(config.prefix + key);
        result.application = that._application;
        return result;
      };

      that["override" + caseType] = function(key, classDef) {
        return that._momentr.override(config.prefix + key, classDef);
      };

      that["get" + caseType + "Def"] = function(key) {
        return that._momentr.def(config.prefix + key).type;
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

  getAllInstances() {
    var that = this;
    var values = this._momentr.getAllInstances();
    values.forEach(function(v){
      v.application = that._application;
    });
    return values;
  };

  get(key) {
    var result = this._momentr.get(key);
    result.application = this._application;
    return result;
  };

  clear() {
    return this._momentr.clear();
  };

  override(key, clazz) {
    return this._momentr.override(key, clazz);
  }
};
