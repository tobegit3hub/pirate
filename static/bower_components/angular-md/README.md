# angular-md [![Analytics](https://ga-beacon.appspot.com/UA-2694988-7/angular-md/readme?pixel)](https://github.com/yaru22/angular-md)
Angular directive to render [Markdown](http://daringfireball.net/projects/markdown/) text. It's built on blazingly fast markdown parser [marked][].

## Demo
Check out the demo [here](http://www.brianpark.ca/projects/angular_md/demo/).

## Usage
Include `angular-md.js` in your project (you can do so via `bower install angular-md`).

Make sure to load [marked][] library. Optionally, load [highlightjs][] library (as well as the corresponding css file) for code highlighting.
Load the directive after loading `angular.js`

```html
<script src="path_to_marked.js"></script>
<script src="path_to_highlightjs.js"></script>
<script src="path_to_angular.js"></script>
<script src="path_to_angular-md.js"></script>
```

Specify angular-md as a dependency of your Angular module.

```js
var app = angular.module('ngApp', [
  'yaru22.md'
]);
```

Use it in your project.

```html
<html ng-app="ngApp">
...
<body>
  <md>
# How to use angular-md
This is a example of how to use angular-md.

- Bullet point 1.
- Bullet point 2.

> To use or not to use...
> - Anonymous
  </md>

  <!-- or -->
  
  <md ng-include="'text.md'"></md>
  
  <!-- or -->
  
  <md ng-model="mdText"></md>
</body>
</html>
```

## License
This seed is released under permissive MIT License.


[highlightjs]: https://github.com/isagalaev/highlight.js  "highlightjs"
[marked]: https://github.com/chjj/marked  "marked"
