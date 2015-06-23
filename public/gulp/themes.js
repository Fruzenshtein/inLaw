'use strict';
var paths = require('./path');
var gulp = require('gulp');
var notify = require('gulp-notify');

gulp.task("themes", function () {
    // TODO: semantic UI (themes, fonts) should be rebuilded to "custom" path
    gulp.src(paths.themes)
        .pipe(gulp.dest(paths.dist + "stylesheets/themes/"))
        .pipe(notify({
          title: "GULP THEMES",
          message: "*** THEMES TASK COMPLETED ***",
          notifier: function (options, callback) {
            // empty function to avoid system pop-up notifier
          }
        }));
});