'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    merge = require('merge-stream');

gulp.task("fonts", function () {
    gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.dist + "fonts/"))
        .on('error', function (error) {
            console.error('FontsTask: ' + error);
        });
});


gulp.task("themes", function () {
    // TODO: semantic UI (themes, fonts) should be rebuilded to "custom" path
    gulp.src(paths.themes)
        .pipe(gulp.dest(paths.dist + "stylesheets/themes/"))
        .on('error', function (error) {
            console.error('Themes task: ' + error);
        });
});

/*
 //TODO: need to be wreritted to merged stream
 gulp.task("fonts", function () {
 var fontsStream = gulp.src(paths.fonts)
 .pipe(gulp.dest(paths.dist + "fonts/"))
 .on('error', function (error) {
 console.error('FontsTask: ' + error);
 });
 // TODO: semantic UI (themes, fonts) should be rebuilded to "custom" path
 var semanticFontsStream = gulp.src(paths.themes)
 .pipe(gulp.dest(paths.dist + "stylesheets/themes/"))
 .on('error', function (error) {
 console.error('Themes task: ' + error);
 });

 return merge(semanticFontsStream, fontsStream);

 });
 */