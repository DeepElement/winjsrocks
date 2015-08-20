var ioc = require('../ioc'),
  winjsHelper = require('../helper/winjs');

exports.itemTemplateSelector = {
  get: function() {
    var instance = ioc.getProvider("template").itemTemplateSelector;
    winjsHelper.markForProcessing(instance);
    return instance;
  }
}
