import WinJS from 'winjs';
import ViewBase from './view/base';

// The anon scope here is important to retaining the original variable
(function() {
  var _pageDefine = WinJS.UI.Pages.define;

  function abs(uri) {
    var a = document.createElement("a");
    a.href = uri;
    return a.href;
  };

  var _override = function(uri, members, baseClassDef) {
    var absUri = abs(uri);
    var pageClassDef = _pageDefine(absUri, members);
    if (baseClassDef) {
      baseClassDef.prototype._winjsPage = pageClassDef;

      // migrate props that are not override
      var propertyNames = Object.getOwnPropertyNames(pageClassDef.prototype);
      for (var i = 0; i <= propertyNames.length - 1; i++) {
        var key = propertyNames[i];
        if (!baseClassDef.prototype[key]) {
          baseClassDef.prototype[key] = pageClassDef.prototype[key];
        }
      }

      WinJS.UI.Pages._viewMap[absUri.toLowerCase()] = baseClassDef;
    }
    return baseClassDef || pageClassDef;
  };

  WinJS.UI.Pages.define = _override;
})();
