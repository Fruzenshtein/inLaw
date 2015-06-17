'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify');

gulp.task('vendorScripts', function() {
    gulp.src(paths.vendorScripts)
        .pipe(concat("vendor.js"))
        .pipe(gulpif(false, rename({suffix: '.min'})))
        .pipe(gulpif(false, uglify()))
        .pipe(gulp.dest(paths.dist + "javascripts/"))
        .pipe(notify({ message: 'VendorScripts task completed' }));

});
