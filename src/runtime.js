var WinJS = require('winjs');

String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.contains = function(target, ordered) {
  ordered = ordered || false;
  var foundAll = true;
  if (ordered) {
    var lastIdx = -1;
    for (var i = 0; i <= target.length - 1; i++) {
      lastIdx = this.indexOf(target[i], lastIdx + 1);
      if (lastIdx == -1) {
        foundAll = false;
        break;
      }
    }
    return foundAll;
  } else {
    for (var i = 0; i <= target.length - 1; i++) {
      if (this.indexOf(target[i]) == -1) {
        foundAll = false;
        break;
      }
    }
    return foundAll;
  }
};

Array.prototype.first = function(delegate) {
  var results = this.filter(delegate);
  if (results.length > 0)
    return results[0];
  return null;
}

String.prototype.replaceAll = function(search, replace) {
  if (replace === undefined) {
    return this.toString();
  }
  return this.split(search).join(replace);
};

Math.getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
};

Math.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
