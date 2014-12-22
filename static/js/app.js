'use strict';

var pirate = angular.module('pirate', [
  'ngRoute'
]);

pirate.controller('NamespacesController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {

  /*
  {
    num_results: 2,
    query: "",
    results: [
      {
        description: "",
        name: "library/busybox"
      },
      {
        description: "",
        name: "library/ubuntu"
      }
    ]
  }
  */
  $http.get('http://10.237.113.19:5555/v1/search').success(function(data) {
    $scope.data = data;
  });




  /*
  {
    13.04: "463ff6be4238c14f5b88898f17b47a9cf494f9a9be7b6170c3e852568d2b0432",
    14.10: "d6028e3b0b3453b96bf682a0f893fc02689ac2697db11b49989356beb2e73bd7"
  }
  */

  $http.get('http://10.237.113.19:5555/v1/repositories/library/ubuntu/tags').success(function(data) {
    $scope.tags = data;
  });


}]);
