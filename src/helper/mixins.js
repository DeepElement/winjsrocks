exports.notify = {
  notify: function(eventName) {
    this.dispatchEvent(eventName, this[eventName]);
  }
};

exports.autoProperty = {
  createAutoProperty: function(propertyName, defaultValue, readonly) {
    if (!readonly) {
      Object.defineProperty(this, propertyName, {
        get: function() {
          if (!this["_" + propertyName])
            this["_" + propertyName] = defaultValue;
          return this["_" + propertyName];
        },
        set: function(val) {
          if (val != this["_" + propertyName]) {
            this["_" + propertyName] = val;
            if (this.notify)
              this.notify(propertyName, val);
          }
        },
        configurable: false,
        enumerable: true
      });
    } else {
      Object.defineProperty(this, "_" + propertyName, {
        get: function() {
          if (!this["__" + propertyName])
            this["__" + propertyName] = defaultValue;
          return this["__" + propertyName];
        },
        set: function(val) {
          if (val != this["__" + propertyName]) {
            this["__" + propertyName] = val;
            if (this.notify)
              this.notify(propertyName, val);
          }
        },
        configurable: false,
        enumerable: false
      });
      Object.defineProperty(this, propertyName, {
        get: function() {
          return this["__" + propertyName];
        },
        configurable: false,
        enumerable: true
      });
    }
  }
};

exports.managedEvents = {
  addManagedEventListener: function(subject, property, handler) {
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
  },

  removeAllManagedEventListeners : function() {
    if (this._managedEvents) {
      this._managedEvents.forEach(function(ctx) {
        if (ctx.subject && ctx.property && ctx.binding && ctx.subject.removeEventListener)
          ctx.subject.removeEventListener(ctx.property, ctx.binding);
      });
      this._managedEvents = null;
    }
  }
};
