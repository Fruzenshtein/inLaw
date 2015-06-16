'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    jshint = require('gulp-jshint');

// Configuration options
var conf = {
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    },
    all: [
        'gulp.js',
        'app/{,*/}*.js',
        'gulp/*.js'
    ],
    test: {
        options: {
            jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
    }
};


gulp.task('jshint', function() {
    gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(conf.options.reporter))

});
