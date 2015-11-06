var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  runSequence = require('run-sequence'),
  rimraf = require('rimraf'),
  babel = require('babel-core/register'),
  fs = require('fs-extra'),
  gutil = require("gulp-util"),
  webpack = require("webpack"),
  webpackConfig = require("./webpack.config.js"),
  packageConfig = require('./package.json'),
  gulpReplace = require('gulp-replace');

gulp.task("dist", function(cb) {
  runSequence(
    'dist:clean',
    'dist:package:debug',
    'dist:package:release',
    cb);
});


gulp.task("npm:pre-publish", function(cb) {
  return gulp.src(['package.json'])
    .pipe(replace(/latest.js/g, "winjsrocks-" + packageConfig.version + ".js"))
    .pipe(gulp.dest('package.json'));
});

gulp.task("dist:package:release", function(cb) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins || [];
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );
  myConfig.output.filename = "dist/winjsrocks-" + packageConfig.version + ".js";

  // run webpack
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    cb();
  });
});

gulp.task("dist:package:debug", function(cb) {
  // modify some webpack config options
  var myDevConfig = Object.create(webpackConfig);
  myDevConfig.devtool = "sourcemap";
  myDevConfig.debug = true;
  myDevConfig.output.filename = "dist/winjsrocks-" + packageConfig.version + ".debug.js";

  // create a single instance of the compiler to allow caching
  var devCompiler = webpack(myDevConfig);

  // run webpack
  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError("webpack:build-dev", err);
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }));
    cb();
  });
});

gulp.task("test", function() {
  return gulp.src('test/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec',
      compilers: {
        js: babel
      },
      timeout: 60000
    }));
});

gulp.task("test:integration", function() {
  return gulp.src('test/integration/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec',
      compilers: {
        js: babel
      },
      timeout: 60000
    }));
});

gulp.task("test:unit", function() {
  return gulp.src('test/unit/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec',
      compilers: {
        js: babel
      },
      timeout: 60000
    }));
});

gulp.task("dist:clean", function(cb) {
  rimraf('./dist', cb);
});
