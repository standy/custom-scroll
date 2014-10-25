var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var size = require('gulp-size');
var template = require('gulp-template');
var prism = require('./prism.js');
var fs = require('fs');


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
    gulp.watch('./custom-scroll/index.src.html', ['index']);
});



gulp.task('index', ['min', 'sizes'], function() {
	var data = {
		sizes: sizes,
		files: {}
	};
	var types = {
		js: 'javascript',
		css: 'css',
		html: 'markup'
	};
	[
		'codes/include.html',
		'codes/how-it-works.html',
		'codes/init.js',
		'codes/api.js',
		'css/jquery.custom-scroll-tiny.css',
		'js/example-advanced.js'
	]
		.forEach(function(filename) {
			var file = fs.readFileSync('custom-scroll/' + filename, 'utf8');
			var type = filename.split('.').pop();

			var filePrism = prism.highlight(file, prism.languages[types[type]]);
			var filePrismNum = '<ol><li>' + filePrism.split('\n</span>').join('</span>\n').split('\n').join('</li><li>') + '</li></ol>';
			data.files[filename] = filePrismNum;
		});
	return gulp.src('./custom-scroll/index.src.html')
		.pipe(template(data))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./custom-scroll'));
});


gulp.task('default', ['min', 'sizes', 'index'], function() {
	return gulp.src(['./custom-scroll/**', '!./custom-scroll/index.src.html', '!./custom-scroll/codes', '!./custom-scroll/codes/**'])
		.pipe(gulp.dest('./../standys.github.io/custom-scroll'));
});
