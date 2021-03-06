'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify');

gulp.task('styles', function() {
    gulp.src(paths.styles)
        .pipe(concat('app.css'))
        .pipe(gulpif(false, rename({suffix: '.min'})))
        .pipe(gulpif(false, minifycss()))
        .pipe(gulp.dest(paths.dist + "stylesheets/"))
        .pipe(notify({
            title: "GULP STYLES",
            message: "*** STYLES TASK COMPLETED ***",
            notifier: function (options, callback) {
                // empty function to avoid system pop-up notifier
            }
        }));
});
