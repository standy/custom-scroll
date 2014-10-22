/* jQuery Custom Scroll plugin | (c) 2014 Mostovoy Andrey | https://github.com/standys/custom-scroll/blob/master/LICENSE */
/*
 * jQuery Custom Scroll plugin
 * https://github.com/standys/custom-scroll
 *
 * Copyright 2014, Mostovoy Andrey
 *
 * Licensed under the MIT license:
 * https://github.com/standys/custom-scroll/blob/master/LICENSE
 */
(function($) {
	$.fn.customScroll = function(options) {
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

	$.fn.customScroll.defaultOptions = {
		prefix: 'custom-scroll_',
		barMinHeight: 10,
		offsetTop: 0,
		offsetBottom: 0,
		barHtml: '<div />'
	};

	function customScroll($container, options) {
		var cs = $container.data('custom-scroll');
		if (cs) options = cs.options;
		else options = $.extend({}, $.fn.customScroll.defaultOptions, options);

		var isBarHidden;

		if ($container.hasClass(options.prefix+'container')) {
			var cs = $container.data('custom-scroll');
			if (cs) {
				cs.updateBar();
				return cs;
			}
		}
		$container.addClass(options.prefix+'container');
		var $inner = $container.children('.'+options.prefix+'inner');
		if (!$inner.length) {
			$inner = $container.wrapInner('<div class="'+options.prefix+'inner'+'"></div>').children();
		}
		var scrollWidth = $inner[0].offsetWidth-$inner[0].clientWidth;
		$inner.css('marginRight', -scrollWidth+'px');
		var $bar = $container.children('.'+options.prefix+'bar');
		if (!$bar.length) {
			$bar = $(options.barHtml).addClass(options.prefix+'bar').appendTo($container);
		}


		var $body = $('body');
		$bar.on('mousedown touchstart', function(e) {
			e.stopPropagation();
			e.preventDefault();
			var scrollTopStart = $inner.scrollTop();
			var clientYStart = e.clientY || e.originalEvent.changedTouches && e.originalEvent.changedTouches[0].clientY;
			var ratio = getHeights().ratio;

			$body.on('mousemove.custom-scroll touchmove.custom-scroll', function(e) {
				e.stopPropagation();
				e.preventDefault();
				var clientY = e.clientY || e.originalEvent.changedTouches && e.originalEvent.changedTouches[0].clientY;
				var diffY = clientY-clientYStart;
				$inner.scrollTop(scrollTopStart + diffY/ratio);
			});
			$body.on('mouseup.custom-scroll touchend.custom-scroll', function() {
				$body.off('.custom-scroll');
			});
		});
		$inner.on('scroll', updateBar);
		updateBar();

		var data = {
			$container: $container,
			$bar: $bar,
			$inner: $inner,
			destroy: destroy,
			updateBar: updateBar,
			options: options
		};
		$container.data('custom-scroll', data);
		return data;


		function getHeights() {
			var heightTotal = $inner.prop('scrollHeight')|0;
			var height = $container.innerHeight();
			var heightScroll = height-options.offsetTop-options.offsetBottom;

			var barHeight = Math.max((heightScroll*height/heightTotal)|0, options.barMinHeight);
			var ratio = (heightScroll-barHeight)/(heightTotal-height);

			return {
				ratio: ratio,
				height: height,
				heightScroll: heightScroll,
				heightTotal: heightTotal,
				barHeight: barHeight
			}
		}

		function updateBar() {
			var y = getHeights();
			var isHide = y.barHeight>=y.heightScroll;
			if (isHide!==isBarHidden) {
				$container.toggleClass(options.prefix+'hidden', isHide);
				isBarHidden = isHide;
			}
			var scrollTop = $inner.scrollTop();
			var barPos = scrollTop*y.ratio;
			if (barPos<0) barPos = 0;
			if (barPos>y.heightScroll-y.barHeight) barPos = y.heightScroll-y.barHeight;
			$bar
				.height(y.barHeight)
				.css('top', options.offsetTop+barPos);
		}

		function destroy() {
			$bar.remove();
			$container.removeClass(options.prefix+'container').removeData('custom-scroll');
			$inner.contents().appendTo($container);
			$inner.remove();
		}
	}
})(jQuery);