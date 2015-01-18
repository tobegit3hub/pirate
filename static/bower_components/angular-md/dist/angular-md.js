'use strict';
angular.module('yaru22.md', []).directive('md', function () {
  if (typeof hljs !== 'undefined') {
    marked.setOptions({
      highlight: function (code, lang) {
        if (lang) {
          return hljs.highlight(lang, code).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });
  }
  return {
    restrict: 'E',
    require: '?ngModel',
    link: function ($scope, $elem, $attrs, ngModel) {
      if (!ngModel) {
        var html = marked($elem.text());
        $elem.html(html);
        return;
      }
      ngModel.$render = function () {
        var html = marked(ngModel.$viewValue || '');
        $elem.html(html);
      };
    }
  };
});