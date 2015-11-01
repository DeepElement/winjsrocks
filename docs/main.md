<img align="right" src="logos/WinJS.rocks-256x256.png">
- [Why WinJS?](#why-winjs)
- [Project Setup](#project-setup)
- [The Holy Triad](#the-holy-triad-models-views-and-viewmodels)
  - [ViewModels](#viewmodels)
  - [Views](#views)
  - [Models](#models)
- [Messages](#messages)
- [Navigation](#navigation)
- [Providers](#providers)
- [Services](#services)
- [Plugins](#plugins)

----
## Why WinJS?

WinJS is a visual framwork that really considers a few important factors that other frameworks fall short on:

- **Input Modalities** - Given a world of accelerating device fragmentation, people interact with UI's from a variety of input patterns. WinJS is built with the exectation that elements should automatically support Mouse, Keyboard, Gesture, Remote and Controller interaction patterns seamlessly. This support is not a weak accessibility-focused implementation, but one that actually attempts to provide core persona support for each input type. 
- **Command/Property Binding** - WinJS supports a variety of markup-driven binding styles that allows developers to avoid common pitfalls with Javascript memory management. This allows clear seperation of concerns when diagnosing memory performant creative View development.  Many frameworks don't do this and seem to encourage Views, Models and Controllers to all be directly bound to the DOM, leaving the advanced topic of [Javascript Memory Profiling](https://developer.chrome.com/devtools/docs/javascript-memory-profiling)
- **Dynamic View Resolve** - Views can be either packaged in the app, fetched from a CDN or remotely generated via Web API. This allows application developers to use the tools that work for creative View development while still offering the advantages of dynamic server-side generation of artifacts.

WinJS is a future-facing UI Framework that really is designed to allow your Information Architecture to adapt to Desktop, Console, Mobile and Web without having to frankenstein your development architecture.

## Project Setup

### Install packages

Install the framework, winjs and plugin packages.

NPM:
```
npm install winjs --save
npm install winjsrocks --save
npm install winsrocks-extras --save
```

While the distribution is compatible with ES5, checkout the see elegance of an ES6 setup at [Win10 rocks](https://github.com/DeepElement/win10rocks).

## The Holy Triad (Models, Views and ViewModels)

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


[logo]: logos/WinJS.rocks-256x256.png "WinJSRocks"
[winjsrocks-adddress]:    http://winjs.rocks
