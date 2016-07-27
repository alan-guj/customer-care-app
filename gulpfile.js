'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var include = require('gulp-include-source');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var yeoman = {
  src:  'src',
  app:  'app',
  dev:  'www',
  prod:  'prod',
  output: 'www'
};

var paths = {
    sass: ['./scss/**/*.scss'],
    scripts: [yeoman.src + '/js/**/*.js'],
    styles: [yeoman.src + '/css/**/*.css'],
    views: {
        main: yeoman.src + '/index.html',
        files: [yeoman.src + '/templates/**/*.html']
    }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, '.tmp/styles');


///////////
// Tasks //
///////////


gulp.task('include',function(done){
    console.log('include');
    gulp.src(paths.views.main)
        .pipe(include())
        .on('error',console.log)
        .pipe(gulp.dest(yeoman.output + '/'));
    done();
})

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('watch', ['build:dev'],function () {
//  gulp.watch('bower.json', ['bower']);
  gulp.watch(paths.styles,['build:dev']);
  gulp.watch(paths.views.main,['client:build:dev']);
  gulp.watch(paths.views.files,['build:dev']);
  gulp.watch(paths.scripts,['build:dev']);
  gulp.watch(paths.sass, ['sass']);

});


// inject bower components
gulp.task('bower', function () {
  return gulp.src('src/index.html')
    .pipe(wiredep({
      directory:  'bower_components',
      ignorePath: '../',
      devDependencies: true
    }))
  .pipe(gulp.dest(yeoman.src + '/'));
});




gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest(yeoman.output + '/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(yeoman.output + '/css/'))
    .on('end', done);
});


gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

///////////
// Build //
///////////

gulp.task('clean:dev', function (cb) {
  rimraf(yeoman.dev, cb);
});

gulp.task('clean:prod', function (cb) {
  rimraf(yeoman.prod, cb);
});

gulp.task('client:build:dev', ['html', 'styles','copy:styles','copy:scripts','copy:bower'], function () {

  return gulp.src(paths.views.main)
    .pipe(include())
    .pipe(gulp.dest(yeoman.output));
});

gulp.task('client:build:prod', ['html', 'styles'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(paths.views.main)
    .pipe(include())
    .pipe($.useref({searchPath: [yeoman.src, '.tmp']}))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe(cssFilter.restore())
    .pipe($.rev())
    .pipe($.revReplace())
    .pipe(gulp.dest(yeoman.output));
});

gulp.task('html', function () {
  return gulp.src(yeoman.src + '/templates/**/*')
    .pipe(gulp.dest(yeoman.output + '/templates'));
});

gulp.task('images', function () {
  return gulp.src(yeoman.src + '/img/**/*')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.output + '/img'));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.src + '/*/.*', { dot: true })
    .pipe(gulp.dest(yeoman.output));
});

gulp.task('copy:libs', function () {
  return gulp.src(yeoman.src + '/libs/**/*')
    .pipe(gulp.dest(yeoman.output + '/libs'));
});


gulp.task('copy:fonts', function () {
  return gulp.src('bower_components/ionic/fonts/*')
    .pipe(gulp.dest(yeoman.output + '/fonts'));
});

gulp.task('copy:styles', function () {
  return gulp.src(paths.styles)
    .pipe(gulp.dest(yeoman.output + '/css'));
});
gulp.task('copy:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(gulp.dest(yeoman.output + '/js'));
});
gulp.task('copy:bower', function () {
  return gulp.src(['bower_components/**/*'])
    .pipe(gulp.dest(yeoman.output + '/bower_components'));
});

gulp.task('build:dev', ['clean:dev'], function () {
  yeoman.output = yeoman.dev;
  runSequence(['bower','images', 'copy:extras', 'copy:libs','copy:fonts','client:build:dev']);
});

gulp.task('build:prod',['clean:prod'], function () {
  yeoman.output = yeoman.prod;
  runSequence(['bower','images', 'copy:extras', 'copy:libs','copy:fonts', 'client:build:prod']);
});

gulp.task('default', ['build:dev']);
