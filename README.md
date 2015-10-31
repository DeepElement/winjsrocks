[![logo]][winjsrocks-adddress]
An [ES6](http://www.ecma-international.org/ecma-262/6.0/) MVVM framework optimized for [WinJS](https://github.com/winjs/winjs)
=====

Built to support amazing app developers targetting:
  - Windows 10
  - XboxOne
  - Windows Phone 10
  - Android
  - iOS
  - FireTV
  - Playstation 3/4/tv
  - Web

----

[![Dependency Status][dependencies-shield]][dependencies] [![Build Status][travis-shield]][travis] [![Download Status][travis-sheild-2]][travis-sheild-2] [![Build Status][travis-shield-develop]][travis] [![devDependency Status][dependencies-dev-shield]][dependencies-dev]

-----

`view.js:`
``` javascript
import WinJSRocks from "winjsrocks";

export default class extends WinJSRocks.View.Page {
  // Polymorphic constructor that already integrates into the WinJS.Page base structure
  constructor(element, viewModel) {
    super(element, viewModel);
  }

  // Ready is supsensed until both:
  //  - View element (this.element) has been loaded into the DOM
  //  - ViewModel loading state has fired
  ready(element, options) {
  
    // Managed events automatically get disconnected when the view unloads
    // The binding context is managed too!
    this.addManagedEventListener(landingPivot.winControl, "selectionchanged",
      this._onPivotSelectionChanged);
  
    return super.ready(element, options);
  }

  _onPivotSelectionChanged() {
    // ViewModel is already bound to the View and can be used to monitor events 
    // and send commands
    this.viewModel.onPivotSelectedCommand.execute();
  }
}

```

Ready to get started? see the full [docs](docs/main.md)



[npm]:                     https://www.npmjs.com/package/winjsrocks
[travis]:                  https://travis-ci.org/deepelement/winjsrocks
[travis-shield]:           https://img.shields.io/travis/DeepElement/winjsrocks.svg?branch=stable
[travis-shield-develop]:   https://img.shields.io/travis/DeepElement/winjsrocks.svg?branch=master
[travis-sheild-2]:         https://img.shields.io/npm/dm/winjsrocks.svg
[dependencies]:            https://david-dm.org/deepelement/winjsrocks
[dependencies-dev]:        https://david-dm.org/deepelement/winjsrocks#info=devDependencies
[dependencies-shield]:     https://img.shields.io/david/deepelement/winjsrocks.svg
[dependencies-dev-shield]: https://img.shields.io/david/dev/deepelement/winjsrocks.svg
[logo]: docs/winjsrocks_animated.gif "WinJSRocks"
[winjsrocks-adddress]:    http://winjs.rocks
