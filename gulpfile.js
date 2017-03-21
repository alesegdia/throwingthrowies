var gulp = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	browser_sync = require('browser-sync').create();

var DEST_DIR = 'dist';

gulp.task('js-build', function () {
	return gulp.src("src/game/**/*")
		.pipe(gulp.dest(DEST_DIR))
		.pipe(concat('game.js'))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest(DEST_DIR));
});

gulp.task('browser-sync', function() {
    browser_sync.init({
		    server: {
	      baseDir: "."
	    }

    });
});

gulp.task('default', ['js-build'], function(){});
