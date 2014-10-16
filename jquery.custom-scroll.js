/*
 * jQuery Custom Scroll plugin
 * https://github.com/standys/custom-scroll
 *
 * Copyright 2014, Mostovoy Andrey
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

(function ($) {
    $.fn.customScroll = function (options) {
        if (options === 'destroy') {
            this.each(function () {
                var cs = $(this).data('custom-scroll');
                if (cs) cs.destroy();
            });
            return this;
        }
        if (this.length === 1) return customScroll(this, options);
        this.each(function () {
            customScroll($(this), options);
        });
    };

    $.fn.customScroll.defaultOptions = {
        prefix: 'custom-scroll_',
        barMinHeight: 10,
        barHtml: '<div />'
    };

    function customScroll($container, options) {
        options = $.extend({}, $.fn.customScroll.defaultOptions, options);
        var isBarHidden;

        if ($container.hasClass(options.prefix + 'container')) {
            var cs = $container.data('custom-scroll');
            if (cs) {
                cs.updateBar();
                return cs;
            }
        }
        $container.addClass(options.prefix + 'container');
        var $inner = $container.children('.' + options.prefix + 'inner');
        if (!$inner.length) {
            $inner = $container.wrapInner('<div class="' + options.prefix + 'inner' + '"></div>').children();
        }
        var $bar = $container.children('.' + options.prefix + 'bar');
        if (!$bar.length) {
            $bar = $(options.barHtml).addClass(options.prefix + 'bar').appendTo($container);
        }


        var $body = $('body');
        $bar.on('mousedown', function (e) {
            var scrollTopStart = $inner.scrollTop();
            var clientYStart = e.clientY;
            var ratio = getHeights().ratio;

            $body.on('mousemove.custom-scroll', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var diffY = e.clientY - clientYStart;
                var scrollTopNew = scrollTopStart + diffY / ratio;
                $inner.scrollTop(scrollTopNew);
            });
            $body.on('mouseup.custom-scroll', function () {
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
            var heightTotal = $inner.prop('scrollHeight') | 0;
            var height = $container.innerHeight();

            var barHeight = Math.max((height * height / heightTotal) | 0, options.barMinHeight);
            var ratio = (height - barHeight) / (heightTotal - height);

            return {
                ratio: ratio,
                height: height,
                heightTotal: heightTotal,
                barHeight: barHeight
            }
        }

        function updateBar() {
            var y = getHeights();
            var isHide = y.barHeight >= y.height;
            if (isHide !== isBarHidden) {
                $bar.toggleClass(options.prefix + 'hidden', isHide);
                isBarHidden = isHide;
            }
            var scrollTop = $inner.scrollTop();
            var barPos = scrollTop * y.ratio;
            if (barPos < 0) barPos = 0;
            if (barPos > y.height - y.barHeight) barPos = y.height - y.barHeight;
            $bar
                .height(y.barHeight)
                .css('top', barPos);
        }

        function destroy() {
            $bar.remove();
            $container.removeClass(options.prefix + 'container').removeData('custom-scroll');
            $inner.contents().appendTo($container);
            $inner.remove();
        }
    }
})(jQuery);