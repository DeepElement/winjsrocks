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

gulp.task("dist", function(cb) {
    runSequence('dist:clean', 'dist:bundle', 'dist:package', cb);
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
        entries: 'dist/winjs-rocks.js',
        fullPaths: false,
        standalone: "WinJSRocks"
    });
    return b.bundle()
        .pipe(source('winjs-rocks.bundle.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task("dist:bundle", function(done) {
    mkdirp(path.join(__dirname, "dist"), function(err) {
        if (err)
            return done(err);

        glob(path.join(__dirname, "src") + "/**/*.js", function(err, files) {
            if (err)
                return done(err);

            var relativeFiles = files.map(function(f){
                return path.join("..", path.relative(".", f));
            });

            var instance = new BrowserifyBridge({
                env: process.env,
                envWhiteList: ['NODE_ENV'],
                package: path.join(__dirname, "package.json"),
                sources: relativeFiles,
                relativeApiRoot: "../src"
            });
            instance.exportToFile(path.join(__dirname, "dist", "winjs-rocks.js"),
                done);
        });
    });
});
