function addContent($lorem, count, phr) {
	if ($lorem.length > 1) {
		$lorem.each(function() {
			addContent($(this), count);
		});
		return;
	}
	count = count || 1;
	phr = phr || 6;
	var phrases = [
		'lorem ipsum dolor sit amet',
		'consectetur adipisicing elit',
		'sed do eiusmod tempor incididunt',
		'ut labore et dolore magna aliqua',
		'ut enim ad minim veniam',
		'quis nostrud exercitation ullamco laboris nisi',
		'ut aliquip ex ea commodo consequat',
		'duis aute irure dolor in reprehenderit',
		'in voluptate velit esse cillum dolore',
		'eu fugiat nulla pariatur',
		'excepteur sint occaecat cupidatat non proident',
		'sunt in culpa qui officia',
		'deserunt mollit anim id est laborum',
		'sed ut perspiciatis',
		'unde omnis iste natus error sit voluptatem',
		'accusantium doloremque laudantium',
		'totam rem aperiam eaque ipsa',
		'quae ab illo inventore veritatis',
		'et quasi architecto beatae vitae dicta sunt',
		'explicabo',
		'nemo enim ipsam voluptatem',
		'quia voluptas sit',
		'aspernatur aut odit aut fugit',
		'sed quia consequuntur magni dolores eos',
		'qui ratione voluptatem sequi nesciunt',
		'neque porro quisquam est'
	];
	var text = '';
	for (var c=0; c<count; c++) {
		var p = '';
		for (var i=0, l=1+rnd(phr/4)+rnd(phr*3/4); i<l; i++) {
			var phrase = phrases[rnd(phrases.length)|0];
			if (!p || p.substring(p.length-2) === '. ') {
				phrase = phrase.charAt(0).toUpperCase() + phrase.substring(1);
			}
			if (i>=l-1) {
				phrase += '.';
			} else {
				phrase += (['.', ',', ',', ','][rnd(7)|0] || '') + ' ';
			}
			p += phrase;
		}
		text += '<p>' + p + '</p>';
	}
	if ($lorem.is('textarea')) {
		var prev = $lorem.val();
		var total = prev + ( prev ? '\n\n' : '') +  text.replace(/<\/p>/g, '\n\n').replace(/<p>/g, '');
		$lorem.val($.trim(total));
	} else if ($lorem.is('.lorem-x')) {
		$lorem.append(text.replace(/<\/p>/g, ' ').replace(/<p>/g, ''));
	} else {
		$lorem.append(text);

	}
	function rnd(n) {
		return Math.random() * n;
	}
}
function removeContent($lorem, count) {
	if ($lorem.length > 1) {
		$lorem.each(function() {
			removeContent($(this), count);
		});
		return;
	}

	count = count || 1;
	if ($lorem.is('textarea')) {
		var text = $lorem.val().split('\n\n');
		$lorem.val(text.slice(0, -count).join('\n\n'))
	} else {
		$lorem.children('p').slice(-count).remove();
	}
}

$('.cs-controls')
	.on('click', '.example-no-wrap', function() {
		var $controls = $(this).closest('.cs-controls');
		$($controls.data('test')).each(function() {
			var $container = $(this);
			$container.toggleClass('no-wrap');
			if (!$container.hasClass('no-init')) $container.customScroll();
		});
	})
	.on('click', '.example-add-content', function() {
		var $controls = $(this).closest('.cs-controls');
		$($controls.data('test')).each(function() {
			var $container = $(this);
			addContent($container.find('.lorem'), 1);
			if (!$container.hasClass('no-init')) $container.customScroll();
		});
	})
	.on('click', '.example-remove-content', function() {
		var $controls = $(this).closest('.cs-controls');
		$($controls.data('test')).each(function() {
			var $container = $(this);
			removeContent($container.find('.lorem'), 1);
			if (!$container.hasClass('no-init')) $container.customScroll();
		});
	})
	.on('click', '.example-init', function() {
		var $controls = $(this).closest('.cs-controls');
		var $container = $($controls.data('test'));
		if (!$container.hasClass('no-init')) $container.customScroll($controls.data('options'));
	})
	.on('click', '.example-destroy', function() {
		var $controls = $(this).closest('.cs-controls');
		var $container = $($controls.data('test'));
		if (!$container.hasClass('no-init')) $container.customScroll('destroy');
	})
	.on('click', '.example-toggle', function() {
		var $controls = $(this).closest('.cs-controls');
		var $container = $($controls.data('test'));
		if (!$container.hasClass('no-init')) $container.toggle();
	});



$('.test-box:not(.guts) .lorem').each(function() {
	addContent($(this), 6);
});

addContent($('#example .lorem'), 4);
addContent($('#example-advanced .lorem'), 3);

$('#example').customScroll();

addContent($('#example-textarea textarea').val(''), 6);
$('#example-textarea').customScroll();


$('#example-hard').customScroll({
	horizontal: false
});

/* tiny */
$('#example-tiny').customScroll({
	prefix: 'custom-scroll-tiny_',
	trackWidth: 5,
	trackHeight: 5
});
/* eo tiny */


/* pretty */
$('#example-pretty').customScroll({
	prefix: 'custom-scroll-pretty_'
});
/* eo pretty */
