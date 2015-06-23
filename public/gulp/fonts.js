'use strict';
var paths = require('./path');
var gulp = require('gulp');
var notify = require('gulp-notify');

gulp.task("fonts", function () {
    gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.dist + "fonts/"))
        .pipe(notify({
            title: "GULP FONTS",
            message: "*** FONTS TASK COMPLETED ***",
            notifier: function (options, callback) {
                // empty function to avoid system pop-up notifier
            }
        }));
});
