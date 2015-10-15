var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  async = require('async'),
  source = require('vinyl-source-stream'),
  runSequence = require('gulp-run-sequence'),
  path = require('path'),
  glob = require("glob"),
  rimraf = require('rimraf'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  BrowserifyBridge = require('browserify-bridge'),
  exec = require('child_process').exec;

var gutil = require("gulp-util"),
  webpack = require("webpack"),
  webpackConfig = require("./webpack.config.js"),
  packageConfig = require('./package.json');

gulp.task("dist", function(cb) {
  runSequence(
    'dist:clean',
    'dist:temp-sources',
    'dist:bundle',
    'dist:package:debug',
    'dist:package:release',
    'dist:package:latest-entry',
    'dist:clean-temp',
    cb);
});

gulp.task("dist:clean-temp", function(cb) {
  async.parallel([
      function(done) {
        rimraf('./dist/temp-sources', done);
      },
      function(done) {
        rimraf("./dist/require-surface.js", done);
      }
    ],
    cb);
});

gulp.task("dist:package:latest-entry", function(cb) {
  fs.writeFile("dist/latest.js",
    "module.exports=require('./winjsrocks-" + packageConfig.version + ".js');", cb
  );
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
  myDevConfig.output.filename = "dist/winjsrocks-." + packageConfig.version + ".debug.js";

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

gulp.task("dist:temp-sources", function(cb) {
  return gulp.src(['./src/**'])
    .pipe(gulp.dest('./dist/temp-sources'));
});


gulp.task("dist:bundle", function(done) {
  mkdirp(path.join(__dirname, "dist"), function(err) {
    if (err)
      return done(err);

    glob(path.join(__dirname, "dist", "temp-sources") + "/**/*.js", function(err, files) {
      if (err)
        return done(err);

      var relativeFiles = files.map(function(f) {
        return "./" + path.join(".", path.relative("./dist", f));
      });

      var instance = new BrowserifyBridge({
        env: process.env,
        envWhiteList: ['NODE_ENV'],
        package: path.join(__dirname, "package.json"),
        sources: relativeFiles,
        relativeApiRoot: "./temp-sources/"
      });
      var outputModuleFile = path.join(__dirname, "dist", "require-surface.js");
      instance.exportToFile(outputModuleFile,
        function() {
          // append custom script
          var s = "for(var key in exports) {\n" +
            "if(key != 'helper.winjs'){" +
            "exports.helper.winjs.markForProcessing(exports[key]);\n" +
            "}}\n";
          fs.appendFile(outputModuleFile, s, function() {
            //rimraf('./dist/temp-sources', function(){
            return done();
            //});
          });
        });
    });
  });
});
