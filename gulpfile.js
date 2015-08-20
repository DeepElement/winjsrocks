var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  async = require('async'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  runSequence = require('gulp-run-sequence'),
  path = require('path'),
  glob = require("glob"),
  rimraf = require('rimraf'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  BrowserifyBridge = require('browserify-bridge');

gulp.task("dist", function(cb) {
  runSequence('dist:clean', 'dist:bundle', 'dist:package', 'dist:add-global-exports', cb);
});

gulp.task("test", function() {
  return gulp.src('test/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec',
      timeout: 60000
    }));
});

gulp.task("test:integration", function() {
  return gulp.src('test/integration/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec',
      timeout: 60000
    }));
});

gulp.task("test:unit", function() {
  return gulp.src('test/unit/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec',
      timeout: 60000
    }));
});

gulp.task("dist:clean", function(cb) {
  rimraf('./dist', cb);
});

gulp.task("dist:package", function() {
  var b = browserify({
    entries: ['./src/main'],
    fullPaths: false,
    debug: process.env.NODE_ENV != "production"
  });
  b.require('./dist/winjsrocks', {
    expose: "winjsrocks"
  });
  return b.bundle()
    .pipe(source('winjsrocks.bundle.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("dist:add-global-exports", function(done) {
  fs.appendFile('./dist/winjsrocks.bundle.js', "if(!window.winjsrocks)window.winjsrocks = require('winjsrocks');", done);
});

gulp.task("dist:bundle", function(done) {
  mkdirp(path.join(__dirname, "dist"), function(err) {
    if (err)
      return done(err);

    glob(path.join(__dirname, "src") + "/**/*.js", function(err, files) {
      if (err)
        return done(err);

      var relativeFiles = files.map(function(f) {
        return path.join("..", path.relative(".", f));
      });

      var instance = new BrowserifyBridge({
        env: process.env,
        envWhiteList: ['NODE_ENV'],
        package: path.join(__dirname, "package.json"),
        sources: relativeFiles,
        relativeApiRoot: "../src"
      });
      var outputModuleFile = path.join(__dirname, "dist", "winjsrocks.js");
      instance.exportToFile(outputModuleFile,
        function() {
          // append custom script
          var s = "for(var key in exports) {\n" +
            "if(key != 'helper.winjs'){" +
            "exports.helper.winjs.markForProcessing(exports[key]);\n" +
            "}}\n";
          fs.appendFile(outputModuleFile, s, done);
        });
    });
  });
});
