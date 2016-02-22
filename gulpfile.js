
'use strict';

// load modules
var gulp = require('gulp');
var sass = require('gulp-sass');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var rimraf = require('gulp-rimraf');
var connect = require('gulp-connect');

// set up connect task for spawning a web server for development
gulp.task('connect-dev', function() { 
	connect.server({
		root: 'app',
		host: '0.0.0.0',
		port: 8080,
		livereload: true
	});
});

// set up connect task for spawning a web server for testing a distributed version
gulp.task('connect-dist', function() {
	connect.server({
		root: 'dist',
		host: '0.0.0.0',
		port: 8080
	});
});

// minification task based on references of html
gulp.task('usemin', function() {
	return gulp.src('./app/*.html')
	.pipe(usemin({
		css: [ minifyCss(), rev() ],
		html: [ minifyHtml({ empty: true }) ],
		js: [ uglify(), rev() ],
	}))
	.pipe(gulp.dest('./dist/'));
});

// .scss compile task
gulp.task('sass', function () {
	return gulp.src('./app/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./app/css'));
});

// copy files for distributed version
gulp.task('copy:views', function(){
	return gulp.src('./app/views/**/*.html')
		.pipe(gulp.dest('./dist/views/'));
});

gulp.task('copy:fonts', function(){
	return gulp.src('./app/fonts/**/*.*')
		.pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('copy:images', function(){
	return gulp.src('./app/img/**/*.*')
		.pipe(gulp.dest('./dist/img/'));
});

// watch for changes
gulp.task('watch', function () {
	gulp.watch('./app/sass/**/*.scss', ['sass']);
	gulp.watch(['./app/**/*.js','./app/**/*.html','./app/**/*.css']).on('change', function(file){
		gulp.src(file.path).pipe(connect.reload()); // reload the pages in browsers which are connected to this host
	});
});

gulp.task('clean:dist', function(){
	return gulp.src(['./dist/'], { read: false })
	.pipe(rimraf());
});

gulp.task('develop', ['sass', 'connect-dev', 'watch']);


gulp.task('deploy', ['clean:dist'], function(cb){
	// this should be a task sequence as above but it looks like clean:dist or maybe rimraf module is not blocking task sequence (allows next task to execute before operation completed)
	// so, we use deprecated method here
	gulp.run(['sass','usemin','copy:views','copy:fonts','copy:images','connect-dist'], function(){ cb(); });
});

gulp.task('default', ['develop']); // run tasks for development by default
