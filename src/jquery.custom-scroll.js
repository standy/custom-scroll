(function($) {
	$.fn.customScroll = function(options) {
		if (this.length === 1) customScroll(this, options);
		this.each(function() {
			customScroll($(this), options);
		})
	};
	var defaultOptions = {
		prefix: 'custom-scroll',
		barMinHeight: 2,
		barHtml: null
	};

	function customScroll($container, options) {
		options = $.extend({}, defaultOptions, options);

		if ($container.hasClass(cls('container'))) {
			var cs = $container.data('custom-scroll');
			cs.updateBar();
			return cs;
		}
		var scrollerHtml = options.barHtml != null ? options.barHtml : '<div class="' + cls('bar') + ' ' + cls('hidden') + '"></div>';
		var $scroller = $(scrollerHtml);
		$container
			.addClass(cls('container'))
			.wrapInner('<div class="' + cls('inner') + '"></div>')
			.append($scroller);
		var $inner = $container.children();

		var store;

		var $body = $('body');
		$scroller.on('mousedown', function(e) {
			var scrollTopStart = $inner.scrollTop();
			var clientYStart = e.clientY;
			var ratio = getHeights().ratio;

			$body.on('mousemove.custom-scroll', function(e) {
				e.stopPropagation();
				e.preventDefault();
				var diffY = e.clientY - clientYStart;
				var scrollTopNew = scrollTopStart + diffY/ratio;
				$inner.scrollTop(scrollTopNew);
			});
			$body.on('mouseup.custom-scroll', function() {
				$body.off('mousemove.custom-scroll');
				$body.off('mouseup.custom-scroll');
			});
		});
		function getHeights() {
			var heightTotal = $inner.prop('scrollHeight')|0;
			var height = $container.innerHeight();

			var barHeight = Math.max((height*height/heightTotal)|0, options.barMinHeight);
			var ratio = (height - barHeight)/(heightTotal - height);

			return {
				ratio: ratio,
				height: height,
				heightTotal: heightTotal,
				barHeight: barHeight
			}
		}


		$inner.on('scroll', updateBar);
		updateBar();

		var data = {
			$container: $container,
			$scroller: $scroller,
			$inner: $inner,
			updateBar: updateBar,
			getHeights: getHeights
		};
		$container.data('custom-scroll', data);
		return data;

		function updateBar() {

			var c = getHeights();
	//		console.log(store, c.height, c.barHeight)
			if (!store || store.height!==c.height || store.heightTotal!==c.heightTotal) {
				$scroller.toggleClass(cls('hidden'), c.barHeight>=c.height);
				store = c;
			}
			var scrollTop = $inner.scrollTop();
			var barTop = scrollTop*c.ratio;
			if (barTop<0) barTop = 0;
			if (barTop>c.height - c.barHeight) barTop = c.height - c.barHeight;
			$scroller
				.height(c.barHeight)
				.css('top', barTop);
		}

		function cls(cls) {
			return options.prefix + '_' + cls;
		}
	}

})(jQuery);
