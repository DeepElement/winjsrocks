var ioc = require('../ioc');

exports.ItemTemplateSelector = {
  get: function() {
    return ioc.getProvider("template").itemTemplateSelector;
  }
}
