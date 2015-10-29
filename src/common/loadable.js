import Component from "./component";
export default class extends Component {
  constructor(application) {
    super(application);
    this._managedEvents = [];
  }

  load(options, callback) {
    return callback();
  }

  unload(options, callback) {
    this.removeAllManagedEventListeners();
    return callback();
  }

  addManagedEventListener(subject, property, handler) {
    if (subject && property && handler) {
      var binding = handler.bind(this);
      this._managedEvents = this._managedEvents || [];
      this._managedEvents.push({
        subject: subject,
        property: property,
        handler: handler,
        binding: binding
      });
      subject.addEventListener(property, binding);
    }
  }

  removeAllManagedEventListeners() {
    if (this._managedEvents) {
      this._managedEvents.forEach(function(ctx) {
        if (ctx.subject && ctx.property && ctx.binding && ctx.subject.removeEventListener)
          ctx.subject.removeEventListener(ctx.property, ctx.binding);
      });
      this._managedEvents = [];
    }
  }
};
