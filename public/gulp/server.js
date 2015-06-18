'use strict';

var gulp = require('gulp');
var exec = require('child_process').exec;

var projectConfig = {
    'serverRun'    : 'cd /Users/universalmind/Dev/GitHub/inLaw/ && activator run',
    'mongodRun' : 'mongod --dbpath=/Users/universalmind/Dev/mongodb/data',
    'mongodStop' : 'mongod --dbpath=/Users/universalmind/Dev/mongodb/data --shutdown'
};

/**
 * Reusable function that executes shell commands
 * @param command (String) that need to be executed by shell
 * @returns {Function}
 */
function runCommand(command) {
    return function (cb) {
        exec(command, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }
}

/**
 * The task runs mongod and scala server in parallel mode
 */
gulp.task('server', function (cb) {
    exec(projectConfig.mongodRun, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    exec(projectConfig.serverRun, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('stop-mongo', runCommand(projectConfig.mongodStop));
