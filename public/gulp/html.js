'use strict';
var paths = require('./path');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var notify = require('gulp-notify');

gulp.task("html", function () {
    gulp.src(paths.templates)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.dist + "assets/"))
        .pipe(notify({
            title: "GULP HTML",
            message: "*** HTML TASK COMPLETED ***",
            notifier: function (options, callback) {
                // empty function to avoid system pop-up notifier
            }
        }));
});