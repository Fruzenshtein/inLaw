'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if');

gulp.task('dev', function() {
    gulp.src(paths.scripts)
        .pipe(concat("app.js"))
        .pipe(gulpif(false, rename({suffix: '.min'})))
        .pipe(gulpif(false, uglify()))
        .pipe(gulp.dest(paths.dist + "javascripts/"));

});
