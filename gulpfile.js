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
  BrowserifyBridge = require('browserify-bridge'),
  exec = require('child_process').exec;

gulp.task("dist", function(cb) {
  runSequence(
    'dist:clean',
    'dist:temp-sources',
    'dist:bundle',

    'dist:package:debug:full',
    'dist:package:debug:winjs-exclude',

    'dist:package:google-closure',

    'dist:package:release:full',
    'dist:package:release:winjs-exclude',

    'dist:package:add-global-exports',
    cb);
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

gulp.task("dist:package:debug:full", function() {
  var b = browserify({
    fullPaths: false,
    debug: true
  });
  b.require('./dist/winjsrocks', {
    expose: "winjsrocks"
  });
  return b.bundle()
    .pipe(source('winjsrocks-bdl.debug.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("dist:package:debug:winjs-exclude", function() {
  var b = browserify({
    fullPaths: false,
    debug: true
  });
  b.require('./dist/winjsrocks', {
    expose: "winjsrocks"
  });
  b.exclude('winjs');
  return b.bundle()
    .pipe(source('winjsrocks-bdl.debug-excludes.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("dist:package:release:full", function() {
  var b = browserify({
    fullPaths: false,
    debug: false
  });
  b.require('./dist/winjsrocks', {
    expose: "winjsrocks"
  });
  return b.bundle()
    .pipe(source('winjsrocks-bdl.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("dist:package:release:winjs-exclude", function() {
  var b = browserify({
    fullPaths: false,
    debug: false
  });
  b.require('./dist/winjsrocks', {
    expose: "winjsrocks"
  });
  b.exclude('winjs');
  return b.bundle()
    .pipe(source('winjsrocks-bdl.excludes.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("dist:package:add-global-exports", function(done) {
  glob("./dist/winjsrocks-bdl*.js", function(er, files) {
    if (er)
      return done(er);
    async.each(files,
      function(file, fileCb) {
        fs.appendFile(file, "if(!window.winjsrocks)window.winjsrocks = require('winjsrocks');", fileCb);
      },
      done);
  })
});

gulp.task("dist:package:google-closure", function(done) {
  glob("./dist/temp-sources/**/*.js", function(err, files) {
    if (err)
      return done(err);
    async.eachSeries(files,
      function(file, fileCb) {
        var fileBaseName = path.basename(file);
        exec('java -jar node_modules/google-closure-compiler/compiler.jar --js ' + file + " " +
          '--js_output_file ' + file + '.closure ' +
          '--compilation_level SIMPLE ' +
          '--language_in ECMASCRIPT5 ' +
          '--formatting=pretty_print ' +
          '--formatting=print_input_delimiter ' +
          '--warning_level QUIET;' +
          'mv ' + file + '.closure ' + file,
          function(err, stdout, stderr) {
            if (stderr)
              console.log(stderr);
            return fileCb(err);
          });
      },
      done);
  });
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
