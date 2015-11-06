<img align="right" width="250px" src="logos/winjsrocks_animated.gif">
Getting Started
=====
- [Why WinJS?](#why-winjs)
- [Sample Apps](#sample-apps)
- [Project Setup](#project-setup)
  - [Install Packages](#install-packages)
  - [Loading](#loading)
  - [Application Entry Point](#application-entry-point)
- [The Holy Triad](#the-holy-triad-models-views-and-viewmodels)
  - [ViewModels](#viewmodels)
  - [Views](#views)
  - [Models](#models)
- [Working with Plugins](#working-with-plugins)
- [Building Providers](#building-providers)

See [Technical Documentation](technical.md) for APIs

----
# Why WinJS?

WinJS is a visual framwork that really considers a few important factors that other frameworks fall short on:

- **Input Modalities** - Given a world of accelerating device fragmentation, people interact with UI's from a variety of input patterns. WinJS is built with the exectation that elements should automatically support Mouse, Keyboard, Gesture, Remote and Controller interaction patterns seamlessly. This support is not a weak accessibility-focused implementation, but one that actually attempts to provide core persona support for each input type.
- **Command/Property Binding** - WinJS supports a variety of markup-driven binding styles that allows developers to avoid common pitfalls with Javascript memory management. This allows clear seperation of concerns when diagnosing memory performant creative View development.  Many frameworks don't do this and seem to encourage Views, Models and Controllers to all be directly bound to the DOM, leaving the advanced topic of [Javascript Memory Profiling](https://developer.chrome.com/devtools/docs/javascript-memory-profiling)
- **Dynamic View Resolve** - Views can be either packaged in the app, fetched from a CDN or remotely generated via Web API. This allows application developers to use the tools that work for creative View development while still offering the advantages of dynamic server-side generation of artifacts.
- **Localization** - Views can use localized strings to bind declaratively and developers can support a wide range of localization sets

WinJS is a future-facing UI Framework that really is designed to allow your Information Architecture to adapt to Desktop, Console, Mobile and Web without having to frankenstein your development architecture.

# Sample Apps

- (In Development) [Win10 rocks](https://github.com/DeepElement/win10rocks) - ES6 cross-platform
- (In Development) WinJSRocks Starter - ES6 Shallow template

# Project Setup

## Install packages

Install the framework and the current WinJS bits:

```
npm install winjs --save
npm install winjsrocks --save
```

> Note: Though WinJSRocks is tested against a [specific version](../package.json) (latest verified) of the [WinJS library](https://github.com/winjs/winjs), the distribution does not package these bits. So, "Bring your own WinJS" and "Millage may vary" if not the same version tested with WinJSRocks.

Optionally, install the maintained pluglin library [WinJSRocks-Extras](https://github.com/DeepElement/winjsrocks-extras). This project includes cool plugins like IndexDB Storage, JQuery Adapters and shows really good examples of how to write your own application plugins.

```
npm install winsrocks-extras --save
```

## Loading
Application developers are required to pre-load `WinJS` before attempting run of the library. 

``` javascript
var WinJS = require('winjs');
var WinJSRocks = require('winjsrocks');
```


## Application Entry Point
Create a version of the Application object:

``` javascript
var WinJSRocks = require('winjsrocks');
var app = new WinJSRocks.Application();
```

Once the application is instatiated, access is available as a singleton:

``` javascript
var app = WinJSRocks.Application.Instance;
```

# The Holy Triad (Models, Views and ViewModels)

## view.js
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

## view-model.js
``` javascript
import WinJSRocks from "winjsrocks";

export default class extends WinJSRocks.ViewModel.Base {
  constructor(application) {
    super(application);
  }

  // All ViewModel classes have a Data property that is
  // posted during navigation events
  onDataSet(callback) {
    var that = this;
    super.onDataSet(function() {
      return callback();
    });
  }

  // Encapsulate your data with Getters/Setters for view binding
  get sampleData(){
    return this._sampleData;
  }

  // Dispatch events when properties are set
  set sampleData(val){
    this._sampleData = val;
    this.notify("sampleData");
  }

  // Expose commands for execution
  get navigateToListPageCommand() {
    return new WinJSRocks.Command.Base(function() {
      console.log("navigateToListPageCommand command called!");
    });
  }
}
```

## view.html
``` html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Landing Screen</title>
</head>

<body>
  <h1>Landing Screen</h1>
  <!-- Bind directly to the ViewModel using ES6 property compatible Binding Helpers  -->
  <div data-win-bind="innerHTML: sampleData WinJSRocks.Binding.Mode.Property"></div>

  <!-- Execute ViewModel Commands directly from markup -->
  <button data-win-bind="onclick: navigateToListPageCommand WinJSRocks.Binding.Mode.Command">Navigate To List Page</button>

  <div id="landingPivot" data-win-control="WinJS.UI.Pivot">
    <div data-win-control="WinJS.UI.PivotItem" data-win-options="{'header': 'PivotItem1'}">
      PivotItem1 Content
    </div>
    <div data-win-control="WinJS.UI.PivotItem" data-win-options="{'header': 'PivotItem2'}">
      PivotItem2 Content
    </div>
  </div>
</body>

</html>
```

#Working with Plugins
Plugins are the recommended way of bolting on features into the WinJSRocks application life-cycle.

These types of components are loaded *after* the core framework has loaded and enables access to all of the goodies (Services/Providers) without any load order mishaps. They are loaded in series, so make sure you provide them in the order of dependence.

To activate, register the class plugin class definition in the `WinJSRocks.Application.Instance.configure` options as a `plugins` array:

``` javascript
var WinJSRocks = require('winjsrocks');
var app = new WinJSRocks.Application();
app.configure({
    plugins:[
      MyAwesomePlugin // Provide the Class Definition of the Plugin
    ]
  },
  function(err){
  });
``` 

# Building Providers

Providers are an elegant design pattern for decoupling application behavior into implementation strategies that might vary in different situations. 

As an example, a common use-case is selecting a provider type to fullfill a need within a service Service at runtime based on measured conditions within application state.

In the WinJSRocks framework, providers have the following expecations:

- remain __Stateless__ (don't expect the same instance to be used in all places)
- Use a self reference to `application` to manage their stateful needs 
- Does all build-up in the Constructor (no load/unload cycle)

To build a provider, inherit from the `WinJSRocks.Provider.Base` class:
``` javascript
import WinJSRocks from "winjsrocks";

export default class KeyboardCatProvider extends WinJSRocks.Provider.Base {
  constructor(application) {
    super(application);
  }
  
  methodA: function(args){
    return this.methodB(args);
  }
  
  methodB: function(args){
    return "Keyboard cat";
  }
};
```

To activate a provider, register using the `WinJSRocks.Application.Instance.builder` before calling `configure`:
``` javascript
var WinJSRocks = require('winjsrocks');
var app = new WinJSRocks.Application();
app.builder.registerProvider("localStorage", KeyboardCatProvider);
``` 

> Providers are registered in the `WinJSRocks.Application.Instance.container` before the `load` method is called on the application instance to assure custom Services and Providers are first-class citizens during application start-up.

[logo]: logos/WinJS.rocks-256x256.png "WinJSRocks"
[winjsrocks-adddress]:    http://winjs.rocks
