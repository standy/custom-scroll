var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var size = require('gulp-size');
var template = require('gulp-template');


var sizes = {};
function saveSizes(newSizes)  {
	for (var key in newSizes) if (newSizes.hasOwnProperty(key)) {
		sizes[key] = newSizes[key].pretty;
	}
}

gulp.task('min', function() {
    return gulp.src(['./jquery.custom-scroll.js'])
        .pipe(uglify({
            preserveComments: function(node, comment) {
                return comment.pos === 0;
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./'));
});


gulp.task('sizes', ['min'], function() {
    return gulp.src(['./jquery.custom-scroll.css', './jquery.custom-scroll.js', './jquery.custom-scroll.min.js'])
        .pipe(size({showFiles: true, gzip: false}, saveSizes))
        .pipe(size({showFiles: true, gzip: true}, saveSizes))
});




gulp.task('copy-js', function() {
    return gulp.src(['./jquery.custom-scroll.js'])
        .pipe(gulp.dest('./custom-scroll/js'));
});

gulp.task('copy-css', function() {
    return gulp.src(['./jquery.custom-scroll.css'])
        .pipe(gulp.dest('./custom-scroll/css'));
});

gulp.task('watch', function() {
    gulp.watch('./jquery.custom-scroll.js', ['copy-js']);
    gulp.watch('./jquery.custom-scroll.css', ['copy-css']);
});



gulp.task('default', ['min', 'sizes'], function() {
	return gulp.src('./custom-scroll/index.src.html')
		.pipe(template({sizes: sizes}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./custom-scroll'));
});



gulp.task('copy', function() {
	return gulp.src(['./custom-scroll/**'])
		.pipe(gulp.dest('./../standys.github.io/custom-scroll'));
});

