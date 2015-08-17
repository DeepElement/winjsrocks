var _log = function(msg) {
  if (process.env.NODE_ENV != "production")
    console.log(msg);
}

module.exports = {
  info: function(msg) {
    _log("info:" + msg);
  },
  warn: function(msg) {
    _log("warn:" + msg);
  }
}
