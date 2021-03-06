'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    notify = require('gulp-notify');

gulp.task('images', function () {
    gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.dist + "images/"))
        .pipe(notify({
            title: "GULP IMAGE",
            message: "*** IMAGES TASK COMPLETED ***",
            notifier: function (options, callback) {
              // empty function to avoid system pop-up notifier
            }
        }));
});