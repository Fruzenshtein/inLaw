'use strict';

var gulp = require('gulp'),
    shell = require('gulp-shell');

var projectRoot = {
    scaleServer: '/Users/universalmind/Dev/GitHub/inLaw/',
    mongod: 'mongod --dbpath=/Users/universalmind/Dev/mongodb/data'
};
// for internal development
gulp.task('shell-internal', shell.task([
    projectRoot.mongod,
    'cd ' + projectRoot.scaleServer + ' && activator run'
]));

