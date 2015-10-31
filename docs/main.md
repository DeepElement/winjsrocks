[![logo]][winjsrocks-adddress]
An [ES6](http://www.ecma-international.org/ecma-262/6.0/) MVVM framework optimized for [WinJS](https://github.com/winjs/winjs)
----

- [Getting Started](#getting-started)
- [The Holy Triad](#the-holy-triad-models-views-and-viewmodels)

----
## Getting Started

### Install packages

Install the framework, winjs and plugin packages.

NPM:
```
npm install winjs --save
npm install winjsrocks --save
npm install winsrocks-extras --save
```
TODO: Bower
TODO: JSPM


## The Holy Triad (Models, Views and ViewModels)
The MVVM pattern is a close variant of the Presentation Model pattern, optimized to leverage some of the core capabilities of WinJS, such as data binding, data templates and commands.

In the MVVM pattern, the view encapsulates the UI and any UI logic, the view model encapsulates presentation logic and state, and the model encapsulates business logic and data. The view interacts with the view model through data binding, commands, and change notification events. The view model queries, observes, and coordinates updates to the model, converting, validating, and aggregating data as necessary for display in the view.

![](https://i-msdn.sec.s-msft.com/dynimg/IC448690.png)

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


[logo]: winjsrocks_animated.gif "WinJSRocks"
[winjsrocks-adddress]:    http://winjs.rocks
