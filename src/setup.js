var ioc = require('./ioc');

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
ioc.registerService("navigation", require('./service/navigation'));
