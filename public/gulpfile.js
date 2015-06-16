'use strict';

var gulp = require('gulp');
// Require all tasks
var requireDir = require('require-dir'),
    dir = requireDir('./gulp', { recurse: true });

var runSequence = require( 'run-sequence').use(gulp);



gulp.task('development', ['clean'], function() {
    runSequence(
        ['dev',
            'jshint'
        ]
    );
});

