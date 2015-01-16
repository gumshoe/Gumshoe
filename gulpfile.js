'use strict';

var gulp = require('gulp'),
  addsrc = require('gulp-add-src'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  uglify = require('gulp-uglify'),

  pkg = require('./package.json');

gulp.task('lint', function () {

  return gulp.src('src/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build', ['lint'], function () {

  return gulp.src('src/gumshoe.js')

    // insert the version
    .pipe(replace('{package_version}', pkg.version))

    // add our transports. important that this happens afterwards
    .pipe(addsrc('src/transports/**/*.js'))

    // prepend our required libs
    .pipe(addsrc.prepend('lib/**/*.js'))

    // combine all of the files into one and output
    .pipe(concat('gumshoe.js'))
    .pipe(gulp.dest('dist'))

    // minify and output
    .pipe(uglify())
    .pipe(rename('gumshoe.min.js'))
    .pipe(gulp.dest('dist'));
});
