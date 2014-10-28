
'use strict';

/* Use JQuery.gritter to popup success message */
function alert_success(message) {
  $.gritter.add({
    title: 'Success!',
    text: message,
    image: 'static/img/seagull-logo.png',
    time: 3000
  });
}

/* Use JQuery.gritter to popup error message */
function alert_error(message) {
  $.gritter.add({
    title: 'Error!',
    text: message,
    image: 'static/img/seagull-logo.png',
    time: 3000
  });
}

/* All angular application controllers */
var pirateControllers = angular.module('pirateControllers', []);

/* This controller to get comment from beego api */
pirateControllers.controller('RepositoriesController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {

  /*
    GET http://96.126.127.93:5000/v1/search
    GET http://96.126.127.93:5000/v1/search?q=seagull

    {
      num_results: 2,
      query: "",
      results:
      [
        {
          description: "",
          name: "library/ubuntu"
        },
        {
          description: "",
          name: "tobegit3hub/seagull"
        }
      ]
    }
  */

  /*
    GET http://96.126.127.93:5000/v1/repositories/library/ubuntu/tags

    {"14.10": "277eb430490785bab9c3c08241f40a3f7181c2809ec6226a308800a5337acc3f"}
  */


  $http.get('http://96.126.127.93:5000/v1/repositories/library/ubuntu/tags').success(function(data) {
    console.log(data);
    var result = Object.keys(data);
    alert_success(result[0]);

  });


  /* Get the version object
  $http.get('http://96.126.127.93:5000/v1/search').success(function(data) {
    console.log(data);
    alert_success(data["results"][0]["name"]);

    $http.get('http://96.126.127.93:5000/v1/repositories/library/ubuntu/tags').success(function(data) {
      console.log(data);
      var result = Object.keys(data);
      alert_success(result[0]);
    });
  });*/

}]);

/* This controller to get comment from beego api */
pirateControllers.controller('ImageController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {

  /* Get the version object */
  $http.get('http://96.126.127.93:5000/v1/repositories/tobegit3hub/seagull/images').success(function(data) {
    alert_success(data);
  });

}]);
