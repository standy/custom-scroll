var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var size = require('gulp-size');


gulp.task('make', function() {

    return gulp.src(['./jquery.custom-scroll.js'])
        .pipe(uglify({
            preserveComments: function(node, comment) {
                return comment.pos === 0;
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});


gulp.task('default', ['make'], function() {
    return gulp.src(['./jquery.custom-scroll.css', './jquery.custom-scroll.js', './jquery.custom-scroll.min.js', ])
        .pipe(size({showFiles: true, gzip: true}))
});

gulp.task('watch', function() {
    gulp.watch('./jquery.custom-scroll.js', ['default']);
});