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
          return this["_" + propertyName];
        },
        configurable: false,
        enumerable: true
      });
    }
  }
}
