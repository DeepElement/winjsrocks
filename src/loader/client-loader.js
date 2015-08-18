var config = require('../config'),
  log = require('../log'),
  ioc = require('../ioc'),
  winjsHelper = require('../helper/winjs');

module.exports = function(options, callback) {
  var hash = options.componentHash;
  // Load Item domain
  var domain = config.get("domain");
  if (domain) {
    for(var modelKey in domain){
      var view = config.get("domain:" + modelKey + ":view");
      var viewClassDef;
      if (view) {
        viewClassDef = hash[view];
        ioc.registerItemView(modelKey, viewClassDef);
      }

      var template = config.get("domain:" + modelKey + ":template");
      if (template) {
        winjsHelper.pageDefine(modelKey, template, viewClassDef);
      }

      var viewModel = config.get("domain:" + modelKey + ":view-model");
      if (viewModel) {
        var viewModelClassDef = hash[viewModel];
        ioc.registerItemViewModel(modelKey, viewModelClassDef);
      }

      var model = config.get("domain:" + modelKey + ":model");
      if (model) {
        var modelClassDef = hash[model];
        ioc.registerItemModel(modelKey, model);
      }
    };
  }

  // Load Pages
  var pages = config.get("pages");
  if (pages) {
    for(var pageKey in pages) {
      var view = config.get("pages:" + pageKey + ":view");
      var viewClassDef;
      if (view) {
        viewClassDef = hash[view];
        ioc.registerView(pageKey, viewClassDef);
      }

      var template = config.get("pages:" + pageKey + ":template");
      if (template) {
        winjsHelper.pageDefine(pageKey, template, viewClassDef);
      }

      var viewModel = config.get("pages:" + pageKey + ":view-model");
      if (viewModel) {
        var viewModelClassDef = hash[viewModel];
        ioc.registerViewModel(pageKey, viewModelClassDef);
      }
    };
  }

  return callback();
}
