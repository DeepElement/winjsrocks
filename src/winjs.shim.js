import WinJS from 'winjs';
import ViewBase from './view/base';

// The Anonymous scope wrapper is required to preserve original
// WinJS.UI.Pages.define
(function() {
  // store the original Pages.define implementation (WinJS Base)
  var _pageDefine = WinJS.UI.Pages.define;

  // re-define the Pages.define method to allow interception of view class
  WinJS.UI.Pages.define = function(uri, members, baseClassDef) {
    // Use the DOM to force format/validate the URL
    var a = document.createElement("a");
    a.href = uri;

    // toLowerCase relates to WinJS's default viewMap key
    var absUri = a.href.toLowerCase();

    // create the WinJS version of the view
    var pageClassDef = _pageDefine(absUri, members);

    // In the case the client supplies a custom base View, allow extension
    if (baseClassDef) {
      // Hide the original WinJS View class definition in the prototype of
      // the client's overriding view
      baseClassDef.prototype._winjsPage = pageClassDef;

      // Migrate all properties/methods on WinJS View class definition that
      // are not already overriden in the Base view class
      var propertyNames = Object.getOwnPropertyNames(pageClassDef.prototype);
      for (var i = 0; i <= propertyNames.length - 1; i++) {
        var key = propertyNames[i];
        if (!baseClassDef.prototype[key]) {
          baseClassDef.prototype[key] = pageClassDef.prototype[key];
        }
      }

      // Update the WinJS viewMap to use the extended client's overriding class
      // definition
      WinJS.UI.Pages._viewMap[absUri.toLowerCase()] = baseClassDef;
    }

    // Return overriden class defintion if available; otherwise, the WinJS
    // class definition
    return baseClassDef || pageClassDef;
  };
})();
