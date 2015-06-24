'use strict';
var paths = require('./path');
var gulp = require('gulp');
var browserSync = require('browser-sync');


gulp.task('bs', function() {
  browserSync({
    // By default, Play is listening on port 9000
    proxy: '0.0.0.0:9000',
    // We will set BrowserSync on the port 9001
    port: 9001,
    // Reload all assets
    // Important: you need to specify the path on your source code
    // not the path on the url
    files: [
      paths.scripts,
      paths.styles,
      paths.fonts,
      paths.images,
      paths.templates
    ],
    logLevel: "debug",
    // Log information about changed files
    logFileChanges: true,
    open: false
  });
});

// outputs changes to files to the console
function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// Return task if something was changed
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts', browserSync.reload])
        .on('change', reportChange);
    gulp.watch(paths.styles, ['styles', 'bs'])
        .on('change', reportChange);
    gulp.watch(paths.fonts, ['fonts', browserSync.reload])
        .on('change', reportChange);
    gulp.watch(paths.images, ['images', browserSync.reload])
        .on('change', reportChange);
    gulp.watch(paths.templates, ['html'], browserSync.reload)
        .on('change', reportChange);

});