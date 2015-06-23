'use strict';
var paths = require('./path');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');

// Configuration options
var conf = {
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    },
    all: [
        'app/**/**/*.js'
    ]
};


gulp.task('jshint', function() {
    gulp.src(conf.all)
        .pipe(jshint())
        .on('error', function() {})
        .pipe(jshint.reporter(conf.options.reporter))
        .pipe(notify({
            title: "GULP JSHINT",
            message: "*** JSHINT TASK COMPLETED ***",
            notifier: function (options, callback) {
                // empty function to avoid system pop-up notifier
            }
        }));

});
