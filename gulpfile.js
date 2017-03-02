var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    react = require('gulp-react');

gulp.task('sass', function() {
  gulp.src('./src/main/resources/static/css/app.scss')
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('./src/main/resources/static/css'))
});

gulp.task('watch', function() {
  gulp.watch('./src/main/resources/static/css/app.scss', ['sass']);
});

gulp.task('concatjs', () => {
    return gulp.src([
            './src/main/resources/static/js/jquery.min.js',
            './src/main/resources/static/js/browser.min.js',
            './src/main/resources/static/js/bootstrap.min.js',
            './src/main/resources/static/js/react.js',
            './src/main/resources/static/js/react-dom.js',
            './src/main/resources/static/js/toastr.min.js',
            './src/main/resources/static/js/moment.js',
            './src/main/resources/static/js/moment-timezone-with-data-2010-2020.js',
            './src/main/resources/static/js/fullcalendar.min.js',
            './src/main/resources/static/js/pikaday.js',
            './src/main/resources/static/js/search.js'
            ])
        .pipe(concat('bundle.js'))
        .pipe(react())
        .pipe(gulp.dest('./src/main/resources/static/js/build'));
});

gulp.task('default', ['sass', 'concatjs', 'watch']);