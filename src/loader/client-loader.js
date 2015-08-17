var config = require('../config'),
  log = require('../log'),
  ioc = require('../ioc'),
  winjsHelper = require('../helper/winjs');

module.exports = function(options, callback) {
  // Load Item domain
  var domain = config.get("domain");
  if (domain) {
    domain.forEach(function(modelKey) {
      var view = config.get("domain:" + modelKey + ":view");
      var viewClassDef;
      if (view) {
        viewClassDef = require(view);
        ioc.registerItemView(modelKey, viewClassDef);
      }

      var template = config.get("domain:" + modelKey + ":template");
      if (template) {
        winjsHelper.pageDefine(modelKey, template, viewClassDef);
      }

      var viewModel = config.get("domain:" + modelKey + ":view-model");
      if (viewModel) {
        var viewModelClassDef = require(viewModel);
        ioc.registerItemViewModel(modelKey, viewModelClassDef);
      }

      var model = config.get("domain:" + modelKey + ":model");
      if (model) {
        var modelClassDef = require(model);
        ioc.registerItemModel(modelKey, model);
      }
    });
  }

  // Load Pages
  var pages = config.get("pages");
  if (pages) {
    pages.forEach(function(pageKey) {
      var view = config.get("page:" + pageKey + ":view");
      var viewClassDef;
      if (view) {
        viewClassDef = require(view);
        ioc.registerView(pageKey, viewClassDef);
      }

      var template = config.get("page:" + pageKey + ":template");
      if (template) {
        winjsHelper.pageDefine(pageKey, template, viewClassDef);
      }

      var viewModel = config.get("page:" + pageKey + ":view-model");
      if (viewModel) {
        var viewModelClassDef = require(viewModel);
        ioc.registerViewModel(pageKey, viewModelClassDef);
      }
    });
  }

  return callback();
}
