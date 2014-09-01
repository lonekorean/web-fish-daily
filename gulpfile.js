var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintStylish = require('jshint-stylish'),
	sass = require('gulp-sass'),
	watch = require('gulp-watch');

var jsPaths = ['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json'],
	scssPaths = ['./public/styles/**/*.scss'];

gulp.task('lint', function() {
	gulp.src(jsPaths)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintStylish));
});

gulp.task('sass', function() {
	gulp.src(scssPaths)
		.pipe(sass({ errLogToConsole: true }))
		.pipe(gulp.dest('./css'));
})

gulp.task('watch', function() {
	gulp.src(jsPaths)
		.pipe(watch())
		.pipe(jshint())
		.pipe(jshint.reporter(jshintStylish));
});
