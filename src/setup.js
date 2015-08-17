var ioc = require('./ioc'),
  WinJS = require('winjs');

// Register Base Classes
require('./model/base');
require('./provider/base');
require('./service/base');
require('./view/base');
require('./view/control');
require('./view/page');
require('./view-model/base');
require('./view-model/item');

ioc.registerProvider("network", require('./provider/network'));
ioc.registerProvider("lokiStorage", require('./provider/loki-storage'));
ioc.registerProvider("localStorage", require('./provider/local-storage'));
ioc.registerProvider("template", require('./provider/template'));

ioc.registerService("navigation", require('./service/navigation'));
ioc.registerService("message", require('./service/message'));
ioc.registerService("application", require('./service/application'));
ioc.registerService("data", require('./service/data'));

// Export globals
window.WinJSRocks = window.WinJSRocks || {};
window.WinJSRocks.Binding = window.WinJSRocks.Binding || {};
window.WinJSRocks.Binding.Mode = window.WinJSRocks.Binding.Mode || {};
window.WinJSRocks.Binding.Mode.Command = require('./binding/mode').command;
window.WinJSRocks.ItemTemplateSelector = ioc.getProvider("template").itemTemplateSelector;
WinJS.Utilities.markSupportedForProcessing(window.WinJSRocks.Binding.Mode.Command);
WinJS.Utilities.markSupportedForProcessing(window.WinJSRocks.ItemTemplateSelector);
