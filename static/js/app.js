'use strict';

var pirate = angular.module('pirate', [
  'ngRoute'
]);

pirate.config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {
    /* Remove the # in url from AngularJS */
    $locationProvider.html5Mode(true);

    $routeProvider.
      /* Use index.html because AngularJS doesn't support nested ng-view */
      when('/', {
        controller: 'IndexController'
      }).
      when('/:image', {
        templateUrl: '/static/html/image.html',
        controller: 'ImageController'
      });
      /* Beego will handle 404
      otherwise({
        redirectTo: '/'
      });
      */
  }]
);

// The controller to get data for index.html
pirate.controller('IndexController', ['$scope', '$rootScope', '$routeParams', '$http', '$route',
  function($scope, $rootScope, $routeParams, $http, $route) {

  // TODO: Use cookie to store the address
  $rootScope.currentRegistry = "http://96.126.127.93:5000";

  $scope.setRegistry = function (newRegistry) {
    // TODO: Test if the new registry works or not by requesting /v1/_ping

    $rootScope.currentRegistry = newRegistry;
    $route.reload(); // TODO: It doesn't work

    // TODO: Remove duplicated code
    $http.get($rootScope.currentRegistry + '/v1/search').success(function(data) {
      $scope.canonicalRepositories = data.results;
      $scope.tags = []; // [[14.10, 13.04], [latest], [latest]]
      $scope.images = [] // [[463ff6, d6028e], [23d93x], [o7081a]];
      for (var i=0; i < $scope.canonicalRepositories.length; i++) {
        var namespace = $scope.canonicalRepositories[i].name.split('/')[0];
        var repository = $scope.canonicalRepositories[i].name.split('/')[1];
        $http.get($rootScope.currentRegistry + '/v1/repositories/' + namespace + '/' + repository + '/tags').success(function(data) {
          var tags = [];
          var images = [];
          for (var key in data) {
            tags.push(key);
            images.push(data[key]);
          }
          $scope.tags.push(tags);
          $scope.images.push(images);
        });
      };
    }).error(function(data){alert('Fail to get data.')});
  };

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

  $http.get($rootScope.currentRegistry + '/v1/search').success(function(data) {

    $scope.canonicalRepositories = data.results;
    $scope.tags = []; // [[14.10, 13.04], [latest], [latest]]
    $scope.images = [] // [[463ff6, d6028e], [23d93x], [o7081a]];

    for (var i=0; i < $scope.canonicalRepositories.length; i++) {
      var namespace = $scope.canonicalRepositories[i].name.split('/')[0];
      var repository = $scope.canonicalRepositories[i].name.split('/')[1];

      /*
      {
        13.04: "463ff6be4238c14f5b88898f17b47a9cf494f9a9be7b6170c3e852568d2b0432",
        14.10: "d6028e3b0b3453b96bf682a0f893fc02689ac2697db11b49989356beb2e73bd7"
      }
      */

      $http.get($rootScope.currentRegistry + '/v1/repositories/' + namespace + '/' + repository + '/tags').success(function(data) {
        var tags = [];
        var images = [];
        for (var key in data) {
          tags.push(key);
          images.push(data[key]);
        }
        $scope.tags.push(tags);
        $scope.images.push(images);
      });

		};

  }).error(function(data){alert('Fail to get data.')});

}]);

pirate.controller('ImageController', ['$scope', '$rootScope', '$routeParams', '$http',
  function($scope, $rootScope, $routeParams, $http) {

    $scope.image = $routeParams.image;

    /*
    {
      id: "d6028e3b0b3453b96bf682a0f893fc02689ac2697db11b49989356beb2e73bd7",
      parent: "dde78202d41703dc39c6bd95b7426a8c2a3975167086f868a0165feff54b7036",
      created: "2014-12-04T17:59:00.877813566Z",
      container: "107af5814451536aa8eebedf46a8d0b73d6dcad21a3865e9562ce6a15ce5e594",
      container_config: {
        Hostname: "7d1406ab3719",
        Domainname: "",
        User: "",
        Memory: 0,
        MemorySwap: 0,
        CpuShares: 0,
        Cpuset: "",
        AttachStdin: false,
        AttachStdout: false,
        AttachStderr: false,
        PortSpecs: null,
        ExposedPorts: null,
        Tty: false,
        OpenStdin: false,
        StdinOnce: false,
        Env: [
          "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ],
        Cmd: [
          "/bin/sh",
          "-c",
          "#(nop) CMD [/bin/bash]"
        ],
        Image: "dde78202d41703dc39c6bd95b7426a8c2a3975167086f868a0165feff54b7036",
        Volumes: null,
        WorkingDir: "",
        Entrypoint: null,
        NetworkDisabled: false,
        OnBuild: [ ],
        SecurityOpt: null
      },
      docker_version: "1.3.1",
      config: {
        Hostname: "7d1406ab3719",
        Domainname: "",
        User: "",
        Memory: 0,
        MemorySwap: 0,
        CpuShares: 0,
        Cpuset: "",
        AttachStdin: false,
        AttachStdout: false,
        AttachStderr: false,
        PortSpecs: null,
        ExposedPorts: null,
        Tty: false,
        OpenStdin: false,
        StdinOnce: false,
        Env: [
          "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ],
        Cmd: [
          "/bin/bash"
        ],
        Image: "dde78202d41703dc39c6bd95b7426a8c2a3975167086f868a0165feff54b7036",
        Volumes: null,
        WorkingDir: "",
        Entrypoint: null,
        NetworkDisabled: false,
        OnBuild: [ ],
        SecurityOpt: null
      },
      architecture: "amd64",
      os: "linux",
      Size: 0
    }
    */

    $http.get($rootScope.currentRegistry + '/v1/images/' + $scope.image + '/json').success(function(data) {
      $scope.data = data;
    });

    /*
    [
      "d6028e3b0b3453b96bf682a0f893fc02689ac2697db11b49989356beb2e73bd7",
      "dde78202d41703dc39c6bd95b7426a8c2a3975167086f868a0165feff54b7036",
      "b526f11c9576f68c570c5be6aeba6e521d57afcd7f498fa60c96770dfc854b56",
      "df50890ba698c3416a84ebce93075abf296a1e1eec3da8fae5cf8231c1b3b678",
      "511136ea3c5a64f264b78b5433614aec563103b4d4702f3ba7d4d2698e22c158"
    ]
    */

    $http.get($rootScope.currentRegistry + '/v1/images/' + $scope.image + '/ancestry').success(function(data) {
      $scope.ancestries = data;
    });

    // TODO: Support delete image

    // TODO: Support edit tag

}]);
