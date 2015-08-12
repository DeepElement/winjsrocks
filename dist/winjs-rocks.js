function a(e,t,n){var r=e,i=t.split("."),s;while(i.length>0){s=i.shift();if(!r[s]){if(i.length>0)r[s]={};else{r[s]=n}}r=r[s]}};

window.process = window.process || {};window.process.env = window.process.env || {};function b(k,v) { window.process.env[k] = v;  };


exports["async"]=require("async");
exports["glob"]=require("glob");
exports["momentr"]=require("momentr");
exports["request"]=require("request");
exports["sprintf-js"]=require("sprintf-js");
exports["underscore"]=require("underscore");
exports["winjs"]=require("winjs");

a(exports,'config', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/config.js')) 
a(exports,'helper.aop', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/helper/aop.js')) 
a(exports,'helper.window', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/helper/window.js')) 
a(exports,'ioc', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/ioc.js')) 
a(exports,'main', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/main.js')) 
a(exports,'model.base', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/model/base.js')) 
a(exports,'provider.base', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/provider/base.js')) 
a(exports,'provider.network', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/provider/network.js')) 
a(exports,'runtime', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/runtime.js')) 
a(exports,'service.base', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/service/base.js')) 
a(exports,'service.message', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/service/message.js')) 
a(exports,'service.navigation', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/service/navigation.js')) 
a(exports,'setup', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/setup.js')) 
a(exports,'view-model.base', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/view-model/base.js')) 
a(exports,'view-model.item', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/view-model/item.js')) 
a(exports,'view.base', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/view/base.js')) 
a(exports,'view.control', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/view/control.js')) 
a(exports,'view.page', require('/home/toddpi314/sources/deepelement/winjs-rocks/src/view/page.js')) 

