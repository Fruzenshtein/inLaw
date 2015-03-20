var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache');
    //sourcemaps = require('gulp-sourcemaps');


var paths = {
    "dist": "devbuild/",
    "vendorScripts": [
        'bower_components/angular/angular.js',
        'bower_components/angular-bootstrap/ui-bootstrap.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-ui-select/dist/select.js',
        'bower_components/lodash/dist/lodash.js',
        'bower_components/moment/moment.js'
    ],
    "scripts": ['app/**/*.js'],
    "fonts": ['fonts/*.*'],
    "templates": ['app/**/*.html'],
    "images": ['images/*.*'],
    "styles": ['app/**/*.css'],
    "vendorStyle": [
        'bower_components/bootstrap/dist/css/*.css',
        'bower_components/angular-ui-select/dist/select.css'
    ]
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

// *************** Dev build, without minification ***************
gulp.task("vendorScripts", function () {
    // Copy all vendor JavaScript
    gulp.src(paths.vendorScripts)
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(paths.dist + "javascripts/"));
});

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
     //   .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.dist + "javascripts/"));
});

gulp.task("styles", function () {
    gulp.src(paths.styles)
        .pipe(concat("app.css"))
        .pipe(gulp.dest(paths.dist + "stylesheets/"));
});

gulp.task("vendorStyles", function () {
    gulp.src(paths.vendorStyle)
        .pipe(concat("vendor.css"))
        .pipe(gulp.dest(paths.dist + "stylesheets/"))
});

gulp.task("fonts", function () {
    gulp.src(paths.fonts).
        pipe(gulp.dest(paths.dist + "fonts/"))
});

gulp.task("images", function () {
    gulp.src(paths.images).
        pipe(gulp.dest(paths.dist + "images/"))
});

gulp.task("templates", function () {
    // Copy all vendor JavaScript
    gulp.src(paths.templates)
        .pipe(gulp.dest(paths.dist + "assets/"));
});

// Run the dev build
gulp.task("build", function () {
    gulp.start("scripts", "vendorScripts", "styles", "vendorStyles", "fonts", "templates", "images");
});

// *************** Production build ***************

gulp.task("vendorScriptsProd", function () {
    // Copy all vendor JavaScript
    gulp.src(paths.vendorScripts)
        .pipe(concat("vendor.js"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + "javascripts/"));
});

gulp.task('scriptsProd', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('app.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist + "javascripts/"));
});


gulp.task("stylesProd", function () {
    gulp.src(paths.styles)
        .pipe(concat("app.css"))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist + "stylesheets/"));
});

gulp.task("vendorStylesProd", function () {
    gulp.src(paths.styles)
        .pipe(concat("vendor.css"))
        .pipe(minifycss())
        .pipe(gulp.dest(paths.dist + "stylesheets/"))
});


gulp.task("production", ["clean"], function () {
    gulp.start("scriptsProd", "vendorScriptsProd", "stylesProd", "fonts", "templates");
});