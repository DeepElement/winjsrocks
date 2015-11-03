import WinJS from 'winjs';
import Component from "../common/component";

export default class extends Component {
  constructor(application) {
    super(application);
  }

  get Command() {
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
          if (command.canExecute) {
            command.execute.call(source, dest);
          }
        };
      }
    });
  }

  get Property() {
    return WinJS.Binding.initializer(function(source, sourceProps, dest, destProps) {
      var eventSource = dest;
      var command = source;
      var sourceItems = destProps.length;
      var destItems = sourceProps.length;
      dest[destProps[0]] = source[sourceProps[0]];
    });
  }
}
