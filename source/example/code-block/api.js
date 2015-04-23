// Full list of options with default values
// All options are optional
$('#example').customScroll({
  prefix: 'custom-scroll_',

  /* vertical */
  barMinHeight: 10,
  offsetTop: 0,
  offsetBottom: 0,
  /* will be added to offsetBottom in case of horizontal scroll */
  trackWidth: 10,

  /* horizontal */
  barMinWidth: 10,
  offsetLeft: 0,
  offsetRight: 0,
  /* will be added to offsetRight in case of vertical scroll */
  trackHeight: 10,

  /* each bar will have custom-scroll_bar-x or y class */
  barHtml: '<div />',

  /* both vertical or horizontal bar can be disabled */
  vertical: true,
  horizontal: true
});


// To recalculate bar position use same method without options
$('#example').customScroll();


// If you need to remove custom-scroll there is 'destroy' method
$('#example').customScroll('destroy');


// To change/get default options use
$.fn.customScroll(someOptions);