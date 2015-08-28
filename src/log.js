module.exports = {
  log: function(msg) {
    if (process.env.NODE_ENV != "test")
      console.log(msg);
  },
  info: function(msg) {
    if (process.env.NODE_ENV != "test")
      console.info(msg);
  },
  warn: function(msg) {
    if (process.env.NODE_ENV != "test")
      console.warn(msg);
  },
  error: function(msg) {
    if (process.env.NODE_ENV != "test")
      console.error(msg);
  },
  element: function(el) {
    var stack = [];
    while (el.parentNode != null) {
      var sibCount = 0;
      var sibIndex = 0;
      for (var i = 0; i < el.parentNode.childNodes.length; i++) {
        var sib = el.parentNode.childNodes[i];
        if (sib.nodeName == el.nodeName) {
          if (sib === el) {
            sibIndex = sibCount;
          }
          sibCount++;
        }
      }
      if (el.hasAttribute('id') && el.id != '') {
        stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
      } else if (sibCount > 1) {
        stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
      } else {
        stack.unshift(el.nodeName.toLowerCase());
      }
      el = el.parentNode;
    }

    return stack.slice(1); // removes the html element
  }
}
