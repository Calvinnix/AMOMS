var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    react = require('gulp-react');

gulp.task('sass', function() {
  gulp.src('./src/main/resources/static/css/app.scss')
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('./src/main/resources/static/css'))
});

gulp.task('watch', function() {
  gulp.watch('./src/main/resources/static/js/*.js', ['minify']);
  gulp.watch('./src/main/resources/static/css/app.scss', ['sass']);
});

gulp.task('minify', () => {
    return gulp.src([
            './src/main/resources/static/js/jquery.min.js',
            './src/main/resources/static/js/browser.min.js',
            './src/main/resources/static/js/bootstrap.min.js',
            './src/main/resources/static/js/react.js',
            './src/main/resources/static/js/react-dom.js',
            './src/main/resources/static/js/toastr.min.js',
            './src/main/resources/static/js/*.js'
            ])
        .pipe(concat('bundle.js'))
        .pipe(react())
        .pipe(gulp.dest('./src/main/resources/static/js/build'));
});

gulp.task('default', ['sass', 'minify', 'watch']);