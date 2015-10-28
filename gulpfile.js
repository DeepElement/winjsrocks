var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  async = require('async'),
  source = require('vinyl-source-stream'),
  runSequence = require('gulp-run-sequence'),
  path = require('path'),
  glob = require("glob"),
  rimraf = require('rimraf'),
  babel = require('babel/register'),
  fs = require('fs-extra'),
  mkdirp = require('mkdirp'),
  exec = require('child_process').exec;

var gutil = require("gulp-util"),
  webpack = require("webpack"),
  webpackConfig = require("./webpack.config.js"),
  packageConfig = require('./package.json');

gulp.task("dist", function(cb) {
  runSequence(
    'dist:clean',
    'dist:package:debug',
    'dist:package:release',
    'dist:package:latest-entry',
    cb);
});

gulp.task("dist:package:latest-entry", function(cb) {
  fs.copy("dist/winjsrocks-" + packageConfig.version + ".js", "dist/latest.js", cb);
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
