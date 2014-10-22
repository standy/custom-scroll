#Customize your scroollbar
JQuery plugin for customizing a scrollbar via css and js  
Watch the [example](http://standys.github.io/custom-scroll/) page
 
Dont forget to include styles on your page

## Documentation
**How it works**  
Plugin expecting that container has a native scroll.  
Its wrap content with another container to hide native bar, after that it draw scrollbar with css

```
$(container).customScroll(options);
```

**Options**
```
//all classes added via plugin has a prefix 
prefix: 'custom-scroll' 

//min height for scrollbar
barMinHeight: 10

//replace a scrollbar html on your choice
barHtml: null
```


To remove custom scroll use 'destroy'
```
$(container).customScroll('destroy');
```

## License
[MIT](https://github.com/standys/custom-scroll/blob/master/LICENSE)