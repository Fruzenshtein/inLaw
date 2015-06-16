'use strict';

module.exports = {
    "dist": "./build/",
    "vendorScripts": [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js',
        // 'bower_components/angular-bootstrap/ui-bootstrap.js',
        'bower_components/semantic-ui/dist/semantic.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-ui-select/dist/select.js',
        'bower_components/ng-slider/dist/ng-slider.min.js',
        'bower_components/lodash/dist/lodash.js',
        'bower_components/moment/moment.js'
    ],
    "scripts": [
        'app/routes.js',
        'app/app.js',
        'app/**/*.js'
    ],
    "fonts": [
        'fonts/*.*'
    ],
    "themes": [
        'bower_components/semantic-ui/dist/themes/*.*'
    ],
    "templates": ['app/**/*.html'],
    "images": ['images/*.*'],
    "styles": ['app/**/*.css'],
    "vendorStyle": [
        'bower_components/bootstrap/dist/css/*.css',
        'bower_components/angular-ui-select/dist/select.css',
        'bower_components/semantic-ui/dist/semantic.css',
        'bower_components/ng-slider/src/css/ng-slider.css'
    ]
};