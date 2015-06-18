'use strict';
var paths = require('./path');
var gulp = require('gulp');

gulp.task("themes", function () {
    // TODO: semantic UI (themes, fonts) should be rebuilded to "custom" path
    gulp.src(paths.themes)
        .pipe(gulp.dest(paths.dist + "stylesheets/themes/"));
});