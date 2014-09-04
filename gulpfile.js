var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	jshintStylish = require('jshint-stylish');

// file paths
var cssSources = ['./styles/**/*.scss'],
	jsFrontSources = ['./scripts/**/*.js'],
	jsBackSources = ['./models/**/*.js', './routes/**/*.js', 'gulpfile.js', 'keystone.js', 'package.json'];

// css stuff
gulp.task('css', function() {
	gulp.src(cssSources)
		.pipe(sass({ errLogToConsole: true }))
		.pipe(autoprefixer())
		.pipe(gulp.dest('./public/css'));
});

// front-end javascript
gulp.task('js-front', function() {
	gulp.src(jsFrontSources)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintStylish))
		.pipe(gulp.dest('./public/js'));
});

// back-end javascript
gulp.task('js-back', function() {
	gulp.src(jsBackSources)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintStylish));
});

// build site
gulp.task('build', ['css', 'js-front', 'js-back']);

// build site and watch for changes
gulp.task('watch', ['build'], function() {
	gulp.watch(cssSources, ['css']);
	gulp.watch(jsFrontSources, ['js-front']);
	gulp.watch(jsBackSources, ['js-back']);
});