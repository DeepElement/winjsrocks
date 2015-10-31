import WinJS from 'winjs';

export default class {
  static get Command() {
    return WinJS.Binding.initializer(function(source, sourceProps, dest, destProps) {
      var eventSource = dest;
      var command = source;
      var sourceItems = destProps.length;
      var destItems = sourceProps.length;

      for (var i = 0; i < sourceItems - 1; i++) {
        eventSource = eventSource[destProps[i]];
      }
      for (var x = 0; x < destItems; x++) {
        command = command[sourceProps[x]];
      }

      if (command) {
        //Subscribes the event
        eventSource[destProps[sourceItems - 1]] = function() {
          if (!WinJS.Utilities.hasClass('win-command-disabled')) {
            command["execute"].call(source, dest);
          }
        };

        //monitors canExecute
        if (command["canExecute"] && !command["canExecute"].value)
          command["canExecute"] = WinJS.Binding.as({
            value: command["canExecute"]
          });
        command["canExecute"].bind("value", function(isEnabled) {
          if (isEnabled) {
            WinJS.Utilities.removeClass(eventSource, 'win-command-disabled');
          } else {
            WinJS.Utilities.addClass(eventSource, 'win-command-disabled');
          }
        });
      }
    });
  }

  static get Property() {
    return WinJS.Binding.initializer(function(source, sourceProps, dest, destProps) {
      var eventSource = dest;
      var command = source;
      var sourceItems = destProps.length;
      var destItems = sourceProps.length;
      dest[destProps[0]] = source[sourceProps[0]];
    });
  }
};
