'use strict';

var gulp = require('gulp');
// Require all tasks
var requireDir = require('require-dir'),
    dir = requireDir('./gulp', { recurse: true });

var runSequence = require( 'run-sequence').use(gulp);



gulp.task('development', ['clean'], function() {
    runSequence([
            'default',
            'jshint',
            'watch']
    );
});

// Internal task that runs Mongod and Scala Server
gulp.task('runServer', function() {
    runSequence('server');
});

gulp.task('default', function() {
    runSequence([
        'scripts',
        'vendorScripts',
        'styles',
        'vendorStyles',
        'html',
        'images',
        'fonts',
        'themes']);
});

gulp.task('production', ['clean'], function() {
   // runSequence([]);
});

