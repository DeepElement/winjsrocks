var ioc = require('../ioc');

exports.itemTemplateSelector = {
  get: function() {
    return ioc.getProvider("template").itemTemplateSelector;
  }
}
