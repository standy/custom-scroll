var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var template = require('gulp-template');
var prism = require('./source/example/prism.js');
var fs = require('fs');

var runSequence = require('run-sequence');
var ghPages = require('gulp-gh-pages');
var gzipSize = require('gzip-size');
var prettyBytes = require('pretty-bytes');
var del = require('del');

gulp.task('default', ['build']);

gulp.task('build', function(cb) {
	runSequence('clear', ['css', 'js', 'example-misc'], 'example-html', cb);
});

gulp.task('dev', ['build'], function() {
	gulp.watch('./source/*.js', ['js']);
	gulp.watch('./source/*.css', ['css']);
	gulp.watch(['./source/example/css/**/*.css', './source/example/js/**/*.js'], ['example-misc']);
	gulp.watch('./source/example/index.html', ['example-html']);
});


gulp.task('gh-pages', ['build'], function () {
	return gulp.src('./dist/example/**/*')
		.pipe(ghPages());
});



gulp.task('clear', function(cb) {
	del(['dist'], cb);
});


gulp.task('css', function() {
	return gulp.src(['./source/*.css'])
		.pipe(gulp.dest('./dist/example/css'));
//		.pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
	return gulp.src(['./source/*.js'])
		.pipe(gulp.dest('./dist/example/js'))
		.pipe(uglify({
			preserveComments: function(node, comment) {
				return comment.pos === 0;
			}
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/example/js'));
});


gulp.task('example-misc', function() {
	return gulp.src(['./source/example/css/**/*.css', './source/example/js/**/*.js'], {base: './source/example'})
		.pipe(gulp.dest('./dist/example'));
});

gulp.task('example-html', ['js', 'css'], function() {
	var data = {
		sizes: {},
		sizesGzipped: {},
		files: {}
	};
	var types = {
		js: 'javascript',
		css: 'css',
		html: 'markup'
	};
	[
		'css/jquery.custom-scroll.css',
		'js/jquery.custom-scroll.js',
		'js/jquery.custom-scroll.min.js'
	].forEach(function(fileName) {
			var stats = fs.statSync('./dist/example/' + fileName);
			data.sizes[fileName] = prettyBytes(stats.size);
			var file = fs.readFileSync('./dist/example/' + fileName, 'utf8');
			data.sizesGzipped[fileName] = prettyBytes(gzipSize.sync(file));
		});

	[
		'code-block/include.html',
		'code-block/how-it-works.html',
		'code-block/init.js',
		'code-block/api.js',
		'css/jquery.custom-scroll-tiny.css',
		'js/example-advanced.js'
	]
		.forEach(function(fileName) {
			var file = fs.readFileSync('./source/example/' + fileName, 'utf8');
			var type = fileName.split('.').pop();
			var filePrism = prism.highlight(file, prism.languages[types[type]]);
			var filePrismNum = '<ol><li>' + filePrism.split('\n</span>').join('</span>\n').split('\n').join('</li><li>') + '</li></ol>';
			data.files[fileName] = filePrismNum;
		});
	return gulp.src('./source/example/index.html')
		.pipe(template(data))
		.pipe(gulp.dest('./dist/example/'));
});

