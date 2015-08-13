exports.notify = {
    notify: function(eventName) {
        this.dispatchEvent(eventName, this[eventName]);
    }
};
