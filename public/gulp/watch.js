'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    liveReload = require('gulp-livereload');

// Return task if something was changed
gulp.task('watch', function() {
    // Create LiveReload server
    liveReload.listen();
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
   // gulp.watch(paths.fonts, ['fonts']);
   // gulp.watch(paths.images, ['images']);
   // gulp.watch(paths.templates, ['html']);

    gulp.watch([
        paths.scripts,
        paths.styles,
        paths.fonts,
        paths.images,
        paths.templates]).on('change', liveReload.changed);
});