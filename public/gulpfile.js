var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload');

var paths = {
    "dist": "deploy/",
    "vendorScripts": [
        'bower_components/angular/angular.js',
        'bower_components/angular-bootstrap/ui-bootstrap.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/angular-ui-select/dist/select.js',
        'bower_components/lodash/dist/lodash.js',
        'bower_components/restangular/dist/restangular.js',
        'bower_components/moment/moment.js'
    ],
    "scripts": ['app/**/*.js'],
    "fonts": ['fonts/*.*'],
    "templates": ['app/**/*.html'],
    "styles": ['app/**/*.css','bower_components/bootstrap/dist/css/*.css']
};

gulp.task("watch", function () {
    gulp.watch('app/**/*.js', ['scripts']);
    gulp.watch('app/**/*.html', ['templates']);
    gulp.watch('app/**/*.css', ['styles']);
});

gulp.task("clean", function () {
    return gulp.src(paths.dist, {read: false})
        .pipe(clean({force: true}));
});


gulp.task("vendorScripts", function () {
    // Copy all vendor JavaScript
    gulp.src(paths.vendorScripts)
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(paths.dist + "js/"));
});

gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.dist + "js/"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});


gulp.task("styles", function () {
    gulp.src(paths.styles)
        .pipe(concat("app.css"))
        .pipe(gulp.dest(paths.dist + "css/"))
});

gulp.task("fonts", function () {
    gulp.src(paths.fonts).
        pipe(gulp.dest(paths.dist + "fonts/"))
});

gulp.task("build", ["clean"], function () {
    gulp.start("scripts", "vendorScripts", "styles", "fonts");
});


gulp.task("production", ["clean"], function () {
    gulp.start("scripts", "vendorScripts", "styles", "fonts");
});