(function() {
	var myCS = $('#example-advanced').customScroll({
		prefix: 'custom-scroll-advanced_',
		offsetTop: 10,
		offsetBottom: 10
	});

	var $track = myCS.$container.find('.custom-scroll-advanced_track-y');
	function myScroll(delta) {
		var $inner = myCS.$inner;
		$inner.animate({'scrollTop': $inner.scrollTop() + delta + 'px'}, 100);
	}
	$track
		.on('click', function(e) {
			var yPos = e.pageY - $(this).offset().top;
			var barTop = myCS.$bar.position().top;
			var h = myCS.$container.height() - 20;
			myScroll(yPos < barTop ? -h : h);
		})
		.on('click', '.arrow', function(e) {
			e.stopPropagation();
			var isTop = $(this).hasClass('top');
			myScroll(isTop ? -50 : 50);
		});
})();