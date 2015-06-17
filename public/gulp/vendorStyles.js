'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify');

gulp.task('vendorStyles', function() {
    gulp.src(paths.vendorStyle)
        .pipe(concat('vendor.css'))
        .pipe(gulpif(false, rename({suffix: '.min'})))
        .pipe(gulpif(false, minifycss()))
        .pipe(gulp.dest(paths.dist + "stylesheets/"))
        .pipe(notify({ message: 'VendorStyles task completed' }));
});
