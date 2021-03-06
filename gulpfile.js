'use strict';

var gulp = require('gulp'),
  addsrc = require('gulp-add-src'),
  concat = require('gulp-concat'),
  del = require('del'),
  jshint = require('gulp-jshint'),
  mochaPhantomJS = require('gulp-mocha-phantomjs'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  uglify = require('gulp-uglify'),
  gfi = require('gulp-file-insert'),

  pkg = require('./package.json');

gulp.task('lint', function () {

  return gulp.src('src/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', ['build'], function () {
  return gulp.src(['test/**/*.html', '!test/**/*-dist.html'])
      .pipe(mochaPhantomJS({}));
});

gulp.task('test-dist', ['build'], function () {
  return gulp.src(['test/**/*-dist.html'])
      .pipe(mochaPhantomJS({}));
});

gulp.task('build', ['lint'], function () {

  del.sync(['dist/**/*.js']);

  return gulp.src('src/gumshoe.js')

    // replace our scoped deps
    .pipe(gfi({
      '// query-string.js': 'lib/query-string.js',
      '// reqwest.js': 'lib/reqwest.js',
      '// store2.js': 'lib/store2.js'
    }))

    // insert the version
    .pipe(replace('{package_version}', pkg.version))

    // add our transports. important that this happens afterwards
    .pipe(addsrc('src/transports/**/*.js'))

    // prepend our required libs
    .pipe(addsrc.prepend([
      'lib/**/*.js',
      '!lib/**/query-string.js',
      '!lib/**/reqwest.js',
      '!lib/**/store2.js',
    ]))

    // combine all of the files into one and output
    .pipe(concat('gumshoe.js'))
    .pipe(gulp.dest('dist'))

    // minify and output
    .pipe(uglify())
    .pipe(rename('gumshoe.min.js'))
    .pipe(gulp.dest('dist'));
});
