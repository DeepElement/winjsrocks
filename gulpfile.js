var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  async = require('async'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  runSequence = require('gulp-run-sequence'),
  path = require('path'),
  glob = require("glob"),
  rimraf = require('rimraf'),
  mkdirp = require('mkdirp'),
  BrowserifyBridge = require('browserify-bridge');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task("build-dist", function(cb) {
  runSequence('clean', 'build-bundle', cb);
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

gulp.task("test-integration", function() {
  return gulp.src('test/integration/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec',
      timeout: 60000
    }));
});

gulp.task("test-unit", function() {
  return gulp.src('test/unit/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec',
      timeout: 60000
    }));
});

gulp.task("clean", function(cb) {
  rimraf('./dist', cb);
});

gulp.task("build-bundle", function(done) {
  mkdirp(path.join(__dirname, "dist"), function(err) {
    if (err)
      return done(err);

    glob(path.join(__dirname, "src") + "/**/*.js", function(err, files) {
      if (err)
        return done(err);

      var instance = new BrowserifyBridge({
        env: process.env,
        envWhiteList: ['NODE_ENV'],
        package: path.join(__dirname, "package.json"),
        sources: files,
        relativeApiRoot: path.join(__dirname, "src")
      });
      instance.exportToFile(path.join(__dirname, "dist", "winjs-rocks.js"),
        done);
    });
  });
});
