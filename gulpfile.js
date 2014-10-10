var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


gulp.task('default', function() {
    return gulp.src(['./jquery.custom-scroll.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});


gulp.task('watch', function() {
    gulp.watch('./jquery.custom-scroll.js', ['default']);
});