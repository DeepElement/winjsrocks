exports.start = function() {
  this._start = null;
  this._end = null;

  gc();
  this._start = process.memoryUsage();
}

exports.end = function() {
  gc();
  this._end = process.memoryUsage();
}

exports.assert = function() {
  var memoryUsage = [this._start, this._end];
  var diffs = memoryUsage.map(function(mm) {
    return {
      rss: mm.rss - memoryUsage[0].rss,
      heapTotal: mm.heapTotal - memoryUsage[0].heapTotal,
      heapUsed: mm.heapUsed - memoryUsage[0].heapUsed
    };
  });

  for (var i = 0; i <= diffs.length - 1; i++)
    for (var m = 0; m <= diffs[i].length - 1; m++) {
      diffs[i][m].should.be.most(0);
    }

  return diffs;
}
