#Customize your scroollbar

 Its a simple, fast, lightweight (~2kB) plugin for jQuery 1.7+
that allows to control bar view using css.

\+ Supporting touch, wheel, middle button and any kind of scrolling  
\+ As fast as native  
\+ Weight incredible small  
\+ Tested with IE7+, mobile and modern browsers 


Watch the [example](http://standy.github.io/custom-scroll/) page

 
## Usage
Init:  
`$(myEl).customScroll([options])`


To recalculate bar position use same method without options:  
`$(myEl).customScroll()`


To remove custom-scroll there is destroy method:  
`$(myEl).customScroll('destroy')`


To change/get default options use:  
`$.fn.customScroll(someOptions)`



## Options

All classes is prefixed:   
`prefix: 'custom-scroll_'`


Height for vertical or width for horizontal:  
`barMin[Height|Width]: 10`


Offsets for bar:  
`offset[Top|Bottom|Left|Right]: 0`


Track height will be added to offsetBottom in case of horizontal scroll appear:  
`track[Width|Height]: 10`


Element for bar:  
`barHtml: '<div />'`



## License
[MIT](https://github.com/standy/custom-scroll/blob/master/LICENSE)
