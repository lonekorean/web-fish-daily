var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintStylish = require('jshint-stylish'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer');

// file paths
var jsFiles = ['./models/**/*.js', './routes/**/*.js', 'gulpfile.js', 'keystone.js', 'package.json'],
	scssFiles = ['./public/styles/**/*.scss'];

// javascript stuff
gulp.task('js', function() {
	gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintStylish));
});

// css stuff
gulp.task('css', function() {
	gulp.src(scssFiles)
		.pipe(sass({ errLogToConsole: true }))
		.pipe(autoprefixer())
		.pipe(gulp.dest('./public/styles'));
});

// build site
gulp.task('build', ['js', 'css']);

// build site and watch for changes
gulp.task('watch', ['build'], function() {
	gulp.watch(jsFiles, ['js']);
	gulp.watch(scssFiles, ['css']);
});