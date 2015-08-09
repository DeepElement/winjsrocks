var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
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
