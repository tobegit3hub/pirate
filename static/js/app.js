

/*
GET http://96.126.127.93:5000/v1/images/102eb2a101b86d72b71930b6603371949b77bfdecf38b77ea69bdfe6308bf24c/ancestry


  ["102eb2a101b86d72b71930b6603371949b77bfdecf38b77ea69bdfe6308bf24c", "e12c576ad8a10e77c2941b3155636e934a28f886aa252cdafb6e9ddc3d73fffe", "511136ea3c5a64f264b78b5433614aec563103b4d4702f3ba7d4d2698e22c158"]%
  */




/*
GET http://96.126.127.93:5000/v1/repositories/library/ubuntu/tags/14.10

"277eb430490785bab9c3c08241f40a3f7181c2809ec6226a308800a5337acc3f"
*/


/*
  GET http://96.126.127.93:5000/v1/repositories/library/ubuntu/images

  [
  {
  id: "511136ea3c5a64f264b78b5433614aec563103b4d4702f3ba7d4d2698e22c158"
  },
  {
  id: "277eb430490785bab9c3c08241f40a3f7181c2809ec6226a308800a5337acc3f"
  },
  {
  id: "530dbbae98a023214dffe0b3d13dcbbd4410f426f86cfd3a9e0af73da53899fa"
  },
  {
  id: "37dde56c3a42c69086ba9e5cd6ca8bba5362cb35db14b077ccf66e9bbb6756d4"
  },
  {
  id: "8f118367086c581e2cc93f7a680ebc1195be66ed311014a044a9908ab9832a35"
  },
  {
  id: "e12c576ad8a10e77c2941b3155636e934a28f886aa252cdafb6e9ddc3d73fffe"
  },
  {
  id: "102eb2a101b86d72b71930b6603371949b77bfdecf38b77ea69bdfe6308bf24c"
  }
  ]
  */

/*
  GET http://96.126.127.93:5000/v1/images/511136ea3c5a64f264b78b5433614aec563103b4d4702f3ba7d4d2698e22c158/json


  {
  id: "511136ea3c5a64f264b78b5433614aec563103b4d4702f3ba7d4d2698e22c158",
  comment: "Imported from -",
  created: "2013-06-13T14:03:50.821769-07:00",
  container_config: {
  Hostname: "",
  User: "",
  Memory: 0,
  MemorySwap: 0,
  CpuShares: 0,
  AttachStdin: false,
  AttachStdout: false,
  AttachStderr: false,
  PortSpecs: null,
  Tty: false,
  OpenStdin: false,
  StdinOnce: false,
  Env: null,
  Cmd: null,
  Dns: null,
  Image: "",
  Volumes: null,
  VolumesFrom: ""
  },
  docker_version: "0.4.0",
  architecture: "x86_64"
  }

  GET http://96.126.127.93:5000/v1/images/277eb430490785bab9c3c08241f40a3f7181c2809ec6226a308800a5337acc3f/json

  {
  id: "277eb430490785bab9c3c08241f40a3f7181c2809ec6226a308800a5337acc3f",
  parent: "8f118367086c581e2cc93f7a680ebc1195be66ed311014a044a9908ab9832a35",
  created: "2014-10-23T23:55:04.026470062Z",
  container: "7696f0f352eb445aa95fbfdc098e3557b5350a185fa733d661526ef941aceee9",
  container_config: {
  Hostname: "1d42a20b09ac",
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
  Image: "8f118367086c581e2cc93f7a680ebc1195be66ed311014a044a9908ab9832a35",
  Volumes: null,
  WorkingDir: "",
  Entrypoint: null,
  NetworkDisabled: false,
  OnBuild: [ ],
  SecurityOpt: null
  },
  docker_version: "1.3.0",
  config: {
  Hostname: "1d42a20b09ac",
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
  Image: "8f118367086c581e2cc93f7a680ebc1195be66ed311014a044a9908ab9832a35",
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


'use strict';

/* The seagull angular application */
var pirate = angular.module('pirate', [
  'ngRoute',
  'pirateControllers',
  'ngCookies', // To save perference of i18n language
  'pascalprecht.translate'
]);

/* Configurate application like router and others*/
pirate.config(['$locationProvider', '$routeProvider', '$httpProvider',
  function($locationProvider, $routeProvider, $httpProvider) {
    /* Remove the # in url from Angular */
    $locationProvider.html5Mode(true);

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    /* Set router, all in /js/controllers.js */
    $routeProvider.
      when('/', {
        templateUrl: '/static/html/repositories.html',
        controller: 'RepositoriesController'
      }).
      when('/image/:id', {
        templateUrl: '/static/html/image.html',
        controller: 'ImageController'
      });
      /* No default page for angular so that beego can process API request
      otherwise({
        redirectTo: '/'
      }); */
  }]
);

/* Filter to convert file size into readable string, code from https://gist.github.com/yrezgui/5653591 */
pirate.filter( 'filesize', function () {
  var units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  return function( bytes, precision ) {
    if ( isNaN( parseFloat( bytes )) || ! isFinite( bytes ) ) {
      return '?';
    }

    var unit = 0;
    while ( bytes >= 1024 ) {
      bytes /= 1024;
      unit ++;
    }
    return bytes.toFixed( + precision ) + ' ' + units[ unit ];
  };
});

/* Filter to convert string array into string */
pirate.filter( 'array_to_string', function () {
  return function( strings ) {
    if ( !Array.isArray(strings) ) {
      return '';
    }

    var result = "";
    for (var i=0; i<strings.length; i++) {
      result += strings[i];
      if (i != strings.length-1) {
        result += ", ";
      }
    }
    return result;
  };
});

/* Filter to convert boolean into string */
pirate.filter( 'boolean_to_string', function () {
  return function( bool ) {
    /* Todo: Determine it is boolean or not but it seems not work
    if ( typeof bool != "boolean" ) {
      return '';
    } */

    if (bool) {
      return "true";
    } else {
      return "false";
    }
  };
});

/* Refer to http://www.ng-newsletter.com/posts/angular-translate.html for i18n */
pirate.controller('IndexController', function ($scope, $translate) {
  /* Change languages with the language string */
  $scope.changeLanguage = function (key) {
    $translate.use(key);
  };

  /* Determine it is English or not */
  $scope.isEnUs = function () {
     return $translate.use() == "en-us";
  }

  /* Determine it is simplified Chinese or not */
  $scope.isZhCn = function () {
	   return $translate.use() == "zh-cn";
  }

  /* Determine it is traditional Chinese or not */
  $scope.isZhHant = function () {
     return $translate.use() == "zh-hant";
  }
});

/* Use angular-translate for i18n and all text should be translated here */
pirate.config(function ($translateProvider) {
  /* Use cookie to store the perference of i18n language */
  $translateProvider.useCookieStorage();

  /* The default language should be English */
  $translateProvider.preferredLanguage('en-us');

  /* Translate into English */
  $translateProvider.translations('en-us', {
    // Index html
    seagull: 'Seagull',
  });

  /* Translate into simplified Chinese */
  $translateProvider.translations('zh-cn', {
    // Index html
    seagull: '海鸥',
  });

  /* Translate into traditional Chinese */
  $translateProvider.translations('zh-hant', {
    // Index html
    seagull: '海鷗',
  });
});
