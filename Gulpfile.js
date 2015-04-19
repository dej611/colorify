var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');

var banner = ['/**',
              '*',
              '* Copyright (c) 2015 Marco Liberati',
              '* Distributed under the GNU GPL v2. For full terms see the file LICENSE.',
              '*',
              '*/'].join('\n');
 
gulp.task('compress', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(header(banner))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['compress']);