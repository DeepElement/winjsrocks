var WinJS = require('winjs');
var _pageDefine = WinJS.UI.Pages.define;

function abs(uri) {
    var a = document.createElement("a");
    a.href = uri;
    return a.href;
};

WinJS.UI.Pages.define = function(uri, members, baseClassDef) {
    var absUri = abs(uri);
    var pageClassDef = _pageDefine(absUri, members);
    baseClassDef.prototype._super = pageClassDef;
    var concreteClassDef = WinJS.Class.derive(pageClassDef,
        baseClassDef, baseClassDef.prototype);
    WinJS.UI.Pages._viewMap[absUri] = concreteClassDef;
    return concreteClassDef;
};
