function addContent($lorem, count) {
	count = count || 1;
	var text = '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';
	$lorem.append( Array(count+1).join(text) );
}
function removeContent($lorem, count) {
	count = count || 1;
	$lorem.children('p').slice(-count).remove();
}

$('.cs-example')
	.on('click', '.example-add-content', function() {
		var $example = $(this).closest('.cs-example');
		var exampleId = $example.data('id');
		var $container = $('#' + exampleId);
		addContent($example.find('.lorem'), 1);
		var isReInit = $example.find('.example-re-init-flag').prop('checked');
		if (isReInit) $container.customScroll();
	})
	.on('click', '.example-remove-content', function() {
		var $example = $(this).closest('.cs-example');
		var exampleId = $example.data('id');
		var $container = $('#' + exampleId);
		removeContent($example.find('.lorem'), 1);
		var isReInit = $example.find('.example-re-init-flag').prop('checked');
		if (isReInit) $container.customScroll();
	})
	.on('click', '.example-re-init', function() {
		var $example = $(this).closest('.cs-example');
		var exampleId = $example.data('id');
		var $container = $('#' + exampleId);
		$container.customScroll();
	});


$('#example1').customScroll();


addContent($('#example2 .lorem'), 3);
$('#example2').customScroll();


addContent($('#example3 .lorem'), 3);
$('#example3').customScroll({
	'barHtml': '<div class="custom-scroll_bar pretty-bar"><div class="arrow top" /><div class="arrow bottom" /><div class="middle" /></div>'
});

addContent($('#example4 .lorem'), 3);
$('#example4').customScroll({
	'barHtml': ''
});
