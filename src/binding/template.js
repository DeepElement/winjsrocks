var ioc = require('../ioc'),
  winjsHelper = require('../helper/winjs');

exports.itemTemplateSelector = {
  get: function() {
    return ioc.getProvider("template").itemTemplateSelector;
  }
}
