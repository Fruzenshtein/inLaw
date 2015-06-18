'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin');

gulp.task("html", function () {
    gulp.src(paths.templates)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.dist + "assets/"));
});