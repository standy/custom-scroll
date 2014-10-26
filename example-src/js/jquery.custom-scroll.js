/* jQuery Custom Scroll plugin v0.6.2 | (c) 2014 Mostovoy Andrey | https://github.com/standy/custom-scroll/blob/master/LICENSE */
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
		barHtml: '<div />'
	};

	function customScroll($container, options) {
		var cs = $container.data('custom-scroll');
		if (cs) options = cs.options;
		else options = $.extend({}, defaultOptions, options);

		var isBarHidden = {};
		var lastDims = {
			x: {},
			y: {}
		};

		if ($container.hasClass(options.prefix+'container')) {
			var cs = $container.data('custom-scroll');
			if (cs) {
				cs.updateBar();
				return cs;
			}
		}
		var $inner = $container.children('.'+options.prefix+'inner');
		if (!$inner.length) {
			$inner = $container.wrapInner('<div class="'+options.prefix+'inner'+'"></div>').children();
		}

		$container.addClass(options.prefix+'container');
		var scrollWidth = $inner[0].offsetWidth-$inner[0].clientWidth;
		var scrollHeight = $inner[0].offsetHeight-$inner[0].clientHeight;
		$inner.css({
			/* save the padding */
			'paddingLeft': $container.css('paddingLeft'),
			'paddingRight': $container.css('paddingRight'),
			/* hide scrolls */
			'marginRight': -scrollWidth+'px',
			'paddingBottom': scrollHeight+'px'
		});
		$container.css({padding: 0});


		var $body = $('body');

		var $bars = {};
		$bars.y = initBar('y');
		$bars.x = initBar('x');

		$inner.on('scroll', updateBar);
		updateBar();

		var data = {
			$container: $container,
			$bar: $bars.y,
			$barX: $bars.x,
			$inner: $inner,
			destroy: destroy,
			updateBar: updateBar,
			options: options
		};
		$container.data('custom-scroll', data);
		return data;


		function initBar(dirKey) {
			var dir = DIRS[dirKey];
			$container['scroll' + dir.Dir](0);

			var cls = options.prefix+'bar'+dir.suffix;
			var $bar = $container.children('.'+ cls);
			if (!$bar.length) {
				$bar = $(options.barHtml).addClass(cls).appendTo($container);
			}

			$bar.on('mousedown touchstart', function(e) {
				e.stopPropagation();
				e.preventDefault();
				var scrollStart = $inner['scroll' + dir.Dir]();
				var posStart = e[dir.clientAxis] || e.originalEvent.changedTouches && e.originalEvent.changedTouches[0][dir.clientAxis];
				var ratio = getDims(dirKey).ratio;

				$body.on('mousemove.custom-scroll touchmove.custom-scroll', function(e) {
					e.stopPropagation();
					e.preventDefault();
					var pos = e[dir.clientAxis] || e.originalEvent.changedTouches && e.originalEvent.changedTouches[0][dir.clientAxis];
					var diff = pos-posStart;
					//console.log('move', scrollStart, diff, ratio)
					$inner['scroll' + dir.Dir](scrollStart + diff/ratio);
				});
				$body.on('mouseup.custom-scroll touchend.custom-scroll', function() {
					$body.off('.custom-scroll');
				});
			});
			return $bar;
		}

		function getDims(dirKey) {
			var dir = DIRS[dirKey];
			var total = $inner.prop('scroll' + dir.Dim)|0;
			var dim = $container['inner' + dir.Dim]();
			//var dim = $container[dir.dim]();
			var inner = $inner['inner' + dir.Dim]();
			var scroll = dim - options['offset' + dir.Dir] - options['offset' + dir.Dir2];
			if (!isBarHidden[dirKey == 'x' ? 'y' : 'x']) scroll -= options['track'+dir.Dim];

			var bar = Math.max((scroll*dim/total)|0, options['barMin' + dir.Dim]);
			var ratio = (scroll-bar)/(total-inner);
			//if (dirKey == 'x' && $container.is('#example')) console.log('dim', dim, inner, scroll, total, bar, ratio)

			return {
				ratio: ratio,
				dim: dim,
				scroll: scroll,
				total: total,
				bar: bar
			}
		}

		function updateBar() {
			upd('y');
			upd('x');
		}
		function upd(dirKey) {
			var dir = DIRS[dirKey];
			var dims = getDims(dirKey);

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
			//console.log('upd', scrollPos, dims.ratio, barPos)
			//if (dirKey === 'y') console.log(barPos, dims.scroll, dims.bar, dims)
			if (barPos<0) barPos = 0;
			if (barPos>dims.scroll-dims.bar) barPos = dims.scroll-dims.bar;
			$bars[dirKey][dir.dim](dims.bar)
				.css(dir.dir, options['offset' + dir.Dir] + barPos);
		}

		function destroy() {
			$bars.x.remove();
			$bars.y.remove();
			$container.removeClass(options.prefix+'container').removeData('custom-scroll');
			$inner.contents().appendTo($container);
			$inner.remove();
		}
	}

	var DIRS = {
		x: {
			dim: 'width',
			Dim: 'Width',
			dir: 'left',
			Dir: 'Left',
			dir2: 'right',
			Dir2: 'Right',
			clientAxis: 'clientX',
			suffix: '-x'
		},
		y: {
			dim: 'height',
			Dim: 'Height',
			dir: 'top',
			Dir: 'Top',
			dir2: 'bottom',
			Dir2: 'Bottom',
			clientAxis: 'clientY',
			suffix: ''
		}
	};


})(jQuery);