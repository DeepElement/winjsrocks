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
    if(baseClassDef)
    {
        baseClassDef.prototype._super = pageClassDef;
    
        // migrate props that are not override
        var propertyNames = Object.getOwnPropertyNames(pageClassDef.prototype);
        for(var i=0; i<=propertyNames.length-1; i++)
        {
            var key = propertyNames[i];
            if (!baseClassDef.prototype[key])
            {
                baseClassDef.prototype[key] = pageClassDef.prototype[key];
            }
        }
    
        WinJS.UI.Pages._viewMap[absUri] = baseClassDef;
    }
    return baseClassDef || pageClassDef;
};
