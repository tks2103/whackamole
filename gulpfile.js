'use strict';

var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    connect = require('gulp-connect'),
    watch   = require('gulp-watch');

var srcDir = "src/",
    fileOrder = ["renderer.js"].map(function(filename) { return srcDir + filename; });

fileOrder.push(srcDir + "**/*.js");

gulp.task('scripts', function () {
  return gulp.src(fileOrder)
             .pipe(concat('main.js'))
             .pipe(gulp.dest('./'))
             .pipe(connect.reload());
});

gulp.task('connect', connect.server({
  root: __dirname + '/',
  port: 9000,
  livereload: true 
}));

gulp.task('watch', ['connect'], function() {
  gulp.watch("src/**/*.js", ['scripts']);
});

gulp.task('build', ['scripts', 'connect', 'watch']);
