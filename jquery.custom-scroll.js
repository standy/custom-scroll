/*
 * jQuery Custom Scroll plugin
 * https://github.com/standys/custom-scroll
 *
 * Copyright 2014, Mostovoy Andrey
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function($) {
	$.fn.customScroll = function(options) {
		if (options === 'destroy') {
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
		barHtml: null,
		doWrap: true,
		predefined: false
	};

	function customScroll($container, options) {
		options = $.extend({}, $.fn.customScroll.defaultOptions, options);
		var store;

		if ($container.hasClass(cls('container'))) {
			var cs = $container.data('custom-scroll');
			if (cs) {
				cs.updateBar();
				return cs;
			}
		}
		if (options.predefined) {
			$inner = $container.children().first();
			$barAndMisc = $container.children().slice(1);
		} else {
			$container.addClass(cls('container'));
			if (options.doWrap) {
				$container.wrapInner('<div class="'+cls('inner')+'"></div>');
				var $inner = $container.children();
			} else {
				$container.addClass(cls('dont-wrap'));
				$inner = $container;
			}

			var barHtml = options.barHtml!=null ? options.barHtml : '<div class="'+cls('bar')+' '+cls('hidden')+'"></div>';
			var $barAndMisc = $(barHtml);
			$container.append($barAndMisc);
		}
		var $bar = $barAndMisc.last();


		var $body = $('body');
		$bar.on('mousedown', function(e) {
			var scrollTopStart = $inner.scrollTop();
			var clientYStart = e.clientY;
			var ratio = getHeights().ratio;

			$body.on('mousemove.custom-scroll', function(e) {
				e.stopPropagation();
				e.preventDefault();
				var diffY = e.clientY-clientYStart;
				var scrollTopNew = scrollTopStart+diffY/ratio;
				$inner.scrollTop(scrollTopNew);
			});
			$body.on('mouseup.custom-scroll', function() {
				$body.off('mousemove.custom-scroll');
				$body.off('mouseup.custom-scroll');
			});
		});
		$inner.on('scroll', updateBar);
		updateBar();

		var data = {
			$container: $container,
			$bar: $bar,
			$inner: $inner,
			destroy: destroy,
			updateBar: updateBar
		};
		$container.data('custom-scroll', data);
		return data;


		function getHeights() {
			var heightTotal = $inner.prop('scrollHeight')|0;
			var height = $container.innerHeight();

			var barHeight = Math.max((height*height/heightTotal)|0, options.barMinHeight);
			var ratio = (height-barHeight)/(heightTotal-height);

			return {
				ratio: ratio,
				height: height,
				heightTotal: heightTotal,
				barHeight: barHeight
			}
		}

		function updateBar() {
			var c = getHeights();
			if (!store || store.height!==c.height || store.heightTotal!==c.heightTotal) {
				$bar.toggleClass(cls('hidden'), c.barHeight>=c.height);
				store = c;
			}
			var scrollTop = $inner.scrollTop();
			var barTop = scrollTop*c.ratio;
			if (!options.doWrap) barTop += scrollTop;
			if (barTop<0) barTop = 0;
			if (options.doWrap) if (barTop>c.height-c.barHeight) barTop = c.height-c.barHeight;
			$bar
				.height(c.barHeight)
				.css('top', barTop);
		}
		function destroy() {
			$barAndMisc.remove();
			$container.removeClass(cls('container')).removeData('custom-scroll');
			if (options.doWrap) {
				$inner.contents().appendTo($container);
				$inner.remove();
			} else {
				$container.removeClass(cls('dont-wrap'));
			}
		}

		function cls(cls) {
			return options.prefix+cls;
		}
	}
})(jQuery);
