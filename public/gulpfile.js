var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
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
    livereload = require('gulp-livereload');

var paths = {
    "dist": "../server/staffing/static/",
    "vendor": ['vendor/underscore/underscore.js',
        'vendor/angular/angular.min.js',
        'vendor/angular-route/angular-route.min.js',
        'vendor/restangular/dist/restangular.min.js',
        'vendor/angular-animate/angular-animate.min.js',
        'vendor/angular-bootstrap/ui-bootstrap-0.7.0.min.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls-0.7.0.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.min.js',
        'vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
        'vendor/momentjs/min/moment.min.js'],
    "scripts": ['app/**/*.js'],
    "fonts": ['app-data/fonts/*.*'],
    "templates": ['app/**/*.html'],
    "styles": ['app/**/*.scss','vendor/angular-bootstrap-colorpicker/css/*.css']
}

gulp.task("watch", function () {
    gulp.watch('app/**/*.js', ['scripts']);
    gulp.watch('app/**/*.html', ['scripts'])
    gulp.watch('app/**/*.scss', ['styles']);
})

gulp.task("default", ["clean"], function () {
    gulp.start("scripts", "vendor", "styles", "fonts");
})

gulp.task("clean", function () {
    return gulp.src(paths.dist, {read: false})
        .pipe(clean({force: true}));
})

gulp.task("vendor", function () {
    gulp.src(paths.vendor)
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(paths.dist + "js/"));
});

gulp.task("scripts", function () {
    var stream = streamqueue({objectMode: true});
    stream.queue(gulp.src(paths.scripts)
        .pipe(ngDepOrder()));
    stream.queue(gulp.src(paths.templates)
        .pipe(html2js({moduleName: "templates"})));
    return stream.done()
        .pipe(concat("app.js"))
        .pipe(gulp.dest(paths.dist + "js/"))
});

gulp.task("styles", function () {
    gulp.src(paths.styles)
        .pipe(sass())
        .pipe(concat("staffing.css"))
        .pipe(gulp.dest(paths.dist + "css/"))
})

gulp.task("fonts", function () {
    gulp.src(paths.fonts).
        pipe(gulp.dest(paths.dist + "fonts/"))
});
