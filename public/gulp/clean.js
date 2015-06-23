'use strict';
var paths = require('./path');
var gulp = require('gulp'),
    del = require('del');

gulp.task('clean', function () {
    // delete all content in the build folder
    // TODO: throws an exception if user @paths variable
    del('/build/**/*');
});