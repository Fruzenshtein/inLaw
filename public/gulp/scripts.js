'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify');

gulp.task('scripts', function() {
    gulp.src(paths.scripts)
        .pipe(concat("app.js"))
        .pipe(gulpif(false, rename({suffix: '.min'})))
        .pipe(gulpif(false, uglify()))
        .pipe(gulp.dest(paths.dist + "javascripts/"))
        .pipe(notify({
            title: "GULP SCRIPTS",
            message: "*** SCRIPTS TASK COMPLETED ***",
            notifier: function (options, callback) {
                // empty function to avoid system pop-up notifier
            }
        }));

});
