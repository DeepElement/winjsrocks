exports.notify = {
  notify: function(eventName) {
    this.dispatchEvent(eventName, this[eventName]);
  }
};

exports.autoProperty = {
  createAutoProperty: function(propertyName, defaultValue) {
    Object.defineProperty(this, propertyName, {
      value: defaultValue,
      get: function() {
        return this[propertyName];
      },
      set: function(val) {
        if (val != this[propertyName]) {
          this[propertyName] = val;
          if (this.notify)
            this.notify(propertyName, val);
        }
      },
      writable: false,
      configurable: false,
      enumerable: true
    });
  }
}
