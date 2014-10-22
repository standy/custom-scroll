#Customize your scroollbar

Watch the [example](http://standys.github.io/custom-scroll/) page

Its a simple, fast, lightweight (~2kB) plugin for jQuery 1.7+
Works fine with all browsers using jQuery.

 + Supporting touch, wheel, middle button and any kind of scrolling
 + As fast as native
 + Weight incredible small

 - No horizontal scroll support, not sure if anyone using it 

 
Dont forget to include styles on your page

## Documentation
```
//all classes added via plugin has a changable prefix 
prefix: 'custom-scroll_' 

//min height for scrollbar
barMinHeight: 10

//top and bottom offset for scrollbar
offsetTop: 0
offsetBottom: 0

//replace a scrollbar html on your choice
barHtml: '<div />'
```


To remove custom scroll use 'destroy'
```
$(container).customScroll('destroy');
```

## License
[MIT](https://github.com/standys/custom-scroll/blob/master/LICENSE)
