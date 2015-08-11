var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  async = require('async'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('sample-build', function() {
  var b = browserify({
    entries: './sample/entry.js'
  });
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./sample/'));
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

gulp.task("test-ci", ['browserify-compile'], function() {
  return gulp.src('test/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'mocha-bamboo-reporter',
      timeout: 300000
    }));
});
