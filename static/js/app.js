'use strict';

var pirate = angular.module('pirate', [
  'ngRoute',
  'pirateControllers'
]);


/* Configurate application like router and others*/
pirate.config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
    /* Remove the # in url from Angular */
    $locationProvider.html5Mode(true);

    /* Set router, all in /js/controllers.js */
    $routeProvider.
      when('/', {
        templateUrl: '/static/html/repositories.html',
        controller: 'RepositoriesController'
      }).
      otherwise({
        redirectTo: '/'
      }); */
  }]
);



pirate.controller('RepositoriesController', ['$scope', '$rootScope', '$routeParams', '$http',
  function($scope, $rootScope, $routeParams, $http) {

  $http.get($rootScope.canonicalServer + '/images/json').success(function(data) {
    $scope.images = data;
  });

}]);
