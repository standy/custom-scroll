/* jQuery Custom Scroll plugin v0.6.6 | (c) 2015 Mostovoy Andrey | https://github.com/standy/custom-scroll/blob/master/LICENSE */
(function($) {
	$.fn.customScroll = function(options) {
		if (!this.length) {
			return $.extend(defaultOptions, options);
		}
		if (options==='destroy') {
			this.each(function() {
				var cs = $(this).data('custom-scroll');
				if (cs) cs.destroy();
			});
			return this;
		}
		if (this.length===1) return customScroll(this, options);
		this.each(function() {
			customScroll($(this), options);
		});
	};


	var defaultOptions = {
		prefix: 'custom-scroll_',
		barMinHeight: 10,
		barMinWidth:  10,
		offsetTop:    0,
		offsetBottom: 0,
		offsetLeft:   0,
		offsetRight:  0,
		trackWidth:   10,
		trackHeight:  10,
		barHtml: '<div />',
		vertical: true,
		horizontal: true,
		preventParentScroll: true
	};

	var DIRS_VERTICAL = {
//		axis: 'y',
		dim: 'height',
		Dim: 'Height',
		dir: 'top',
		Dir: 'Top',
		dir2: 'bottom',
		Dir2: 'Bottom',
		clientAxis: 'clientY',
		suffix: '-y'
	};
	var DIRS_HORIZONTAL = {
//		axis: 'x',
		dim: 'width',
		Dim: 'Width',
		dir: 'left',
		Dir: 'Left',
		dir2: 'right',
		Dir2: 'Right',
		clientAxis: 'clientX',
		suffix: '-x'
	};

	function customScroll($container, options) {
		var cs = $container.data('custom-scroll');
		if (cs) options = cs.options;
		else options = $.extend({}, defaultOptions, options);
		var dirs = {};
		var lastDims = {};

		var isBarHidden = {
			x: +options.vertical,
			y: +options.horizontal
		};

		if (options.horizontal) {
			dirs.x = DIRS_HORIZONTAL;
			lastDims.x = {};
		}
		if (options.vertical) {
			dirs.y = DIRS_VERTICAL;
			lastDims.y = {};
		}

		if ($container.hasClass(options.prefix+'container') && cs) {
			cs.updateBars();
			return cs;
		}
		var $inner = $container.children('.'+options.prefix+'inner');
		if (!$inner.length) {
			$inner = $container.wrapInner('<div class="'+options.prefix+'inner'+'"></div>').children();
		}

		$container.addClass(options.prefix+'container');


		// scroll dimensions in case of hidden element
		var tmp = $('<div class="'+ options.prefix+'inner" />').width(100).height(100).appendTo('body').css({overflow:'scroll'})[0];
		var scrollWidth = tmp.offsetWidth-tmp.clientWidth;
		var scrollHeight = tmp.offsetHeight-tmp.clientHeight;
		tmp.parentElement.removeChild(tmp);

		if (options.vertical) {
			$inner.css({
				/* save the padding */
				paddingLeft: $container.css('paddingLeft'),
				paddingRight: $container.css('paddingRight'),
				/* hide scrolls */
				marginRight: -scrollWidth+'px'

			});
			$container.css({
				paddingLeft: 0,
				paddingRight: 0
			});
		} else {
			$inner.css({overflowY: 'hidden'})
		}
		if (options.horizontal) {
			$inner.css({
				/* hide scrolls */
				marginBottom: -scrollHeight+'px',
				paddingBottom: scrollHeight+'px'
			});
			$container.css({
				paddingTop: 0,
				paddingBottom: 0
			});
		} else {
			$inner.css({overflowX: 'hidden'})
		}

		/* in case of max-height */
		var maxHeight = $container.css('maxHeight');
		if (parseInt(maxHeight)) {
			$container.css('maxHeight', 'none');
			$inner.css('maxHeight', maxHeight);
		}


		$container.scrollTop(0);


		var $body = $('body');

		var $bars = {};
		$.each(dirs, initBar);

		$inner.on('scroll', updateBars);
		updateBars();
		if (options.preventParentScroll) preventParentScroll();

		var data = {
			$container: $container,
			$bar: $bars.y,
			$barX: $bars.x,
			$inner: $inner,
			destroy: destroy,
			updateBars: updateBars,
			options: options
		};
		$container.data('custom-scroll', data);
		return data;


		function preventParentScroll() {
			$inner.on('DOMMouseScroll mousewheel', function(e) {
				var $this = $(this);
				var scrollTop = this.scrollTop;
				var scrollHeight = this.scrollHeight;
				var height = $this.height();
				var delta = (e.type == 'DOMMouseScroll' ? e.originalEvent.detail * -40 : e.originalEvent.wheelDelta);
				var up = delta > 0;

				if (up ? scrollTop === 0 : scrollTop === scrollHeight - height) {
					e.preventDefault();
				}
			});
		}

		function initBar(dirKey, dir) {
//			console.log('initBar', dirKey, dir)
//			var dir = DIRS[dirKey];
			$container['scroll' + dir.Dir](0);

			var cls = options.prefix+'bar'+dir.suffix;
			var $bar = $container.children('.'+ cls);
			if (!$bar.length) {
				$bar = $(options.barHtml).addClass(cls).appendTo($container);
			}

			$bar.on('mousedown touchstart', function(e) {
				e.preventDefault(); // stop scrolling in ie9
				var scrollStart = $inner['scroll' + dir.Dir]();
				var posStart = e[dir.clientAxis] || e.originalEvent.changedTouches && e.originalEvent.changedTouches[0][dir.clientAxis];
				var ratio = getDims(dirKey, dir).ratio;

				$body.on('mousemove.custom-scroll touchmove.custom-scroll', function(e) {
					e.preventDefault(); // stop scrolling
					var pos = e[dir.clientAxis] || e.originalEvent.changedTouches && e.originalEvent.changedTouches[0][dir.clientAxis];
					$inner['scroll' + dir.Dir](scrollStart + (pos-posStart)/ratio);
				});
				$body.on('mouseup.custom-scroll touchend.custom-scroll', function() {
					$body.off('.custom-scroll');
				});
			});
			$bars[dirKey] = $bar;
		}

		function getDims(dirKey, dir) {
//			console.log('getDims', dirKey, dir)
			var total = $inner.prop('scroll' + dir.Dim)|0;
			var dim = $container['inner' + dir.Dim]();
			var inner = $inner['inner' + dir.Dim]();
			var scroll = dim - options['offset' + dir.Dir] - options['offset' + dir.Dir2];
			if (!isBarHidden[dirKey == 'x' ? 'y' : 'x']) scroll -= options['track'+dir.Dim];

			var bar = Math.max((scroll*dim/total)|0, options['barMin' + dir.Dim]);
			var ratio = (scroll-bar)/(total-inner);
//			if (dirKey == 'y' && $container.is('#example-hard')) console.log('dim', dim, inner, scroll, total, bar, ratio)

			return {
				ratio: ratio,
				dim: dim,
				scroll: scroll,
				total: total,
				bar: bar
			}
		}

		function updateBars() {
			$.each(dirs, updateBar);
		}
		function updateBar(dirKey, dir) {
//			var dir = DIRS[dirKey];
			var dims = getDims(dirKey, dir);
			if (!dims.total) return;

			var scrollPos = $inner['scroll' + dir.Dir]();
			if (
				lastDims[dirKey].scrollPos === scrollPos &&
				lastDims[dirKey].scroll === dims.scroll &&
				lastDims[dirKey].total === dims.total
			) return;
			lastDims[dirKey] = dims;
			lastDims[dirKey].scrollPos = scrollPos;


			var isHide = dims.bar>=dims.scroll;
			if (isHide!==isBarHidden[dirKey]) {
				$container.toggleClass(options.prefix+'hidden'+dir.suffix, isHide);
				isBarHidden[dirKey] = isHide;
			}
			var barPos = scrollPos*dims.ratio;
//			console.log('upd', scrollPos, dims.ratio, barPos)
			//if (dirKey === 'y') console.log(barPos, dims.scroll, dims.bar, dims)
			if (barPos<0) barPos = 0;
			if (barPos>dims.scroll-dims.bar) barPos = dims.scroll-dims.bar;
			$bars[dirKey][dir.dim](dims.bar)
				.css(dir.dir, options['offset' + dir.Dir] + barPos);
		}

		function destroy() {
			$.each(dirs, function(key) { $bars[key].remove(); });
			$container
				.removeClass(options.prefix+'container')
				.removeData('custom-scroll')
				.css({padding: '', maxHeight: ''});
			$inner.contents().appendTo($container);
			$inner.remove();
		}
	}
})(jQuery);
