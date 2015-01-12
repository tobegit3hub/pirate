'use strict';

/* Use JQuery.gritter to popup success message */
function alert_success(message) {
    $.gritter.add({
        title: 'Success!',
        text: message,
        image: 'static/img/pirate-logo.png',
        time: 3000
    });
}

/* Use JQuery.gritter to popup error message */
function alert_error(message) {
    $.gritter.add({
        title: 'Error!',
        text: message,
        image: 'static/img/pirate-logo.png',
        time: 3000
    });
}

/* All angular application controllers */
var seagullControllers = angular.module('seagullControllers', []);

/* This controller to get comment from beego api */
seagullControllers.controller('HomeController', ['$scope', '$routeParams', 'dockerService',
    function ($scope, $routeParams, dockerService) {

        /* Get the version object */
        dockerService.getVersion().then(function (version) {
            $scope.version = version;
            $scope.Os = version.Os;
            $scope.KernelVersion = version.KernelVersion;
            $scope.GoVersion =version.GoVersion;
            $scope.Version = version.Version;
        });

        /* Get the info object */
        dockerService.getInfo().then(function (info) {
            $scope.info = info;
            $scope.Containers = info.Containers;
            $scope.Images = info.Images;
        });
    }]);

/* Images controller requests beego API server to get/delete images */
seagullControllers.controller('ImagesController', ['$scope', '$routeParams', '$http', 'dockerService',
    function ($scope, $routeParams, $http, dockerService) {

        /* Refer to https://docs.docker.com/reference/api/docker_remote_api_v1.14/#inspect-an-image
         [{
         "RepoTags": [
         "ubuntu:12.04",
         "ubuntu:precise",
         "ubuntu:latest"
         ],
         "Id": "8dbd9e392a964056420e5d58ca5cc376ef18e2de93b5cc90e868a1bbc8318c1c",
         "Created": 1365714795,
         "Size": 131506275,
         "VirtualSize": 131506275,
         "ParentId": c738822faf4d5f2c93632645b4a2870a668357e961f2731a1da460d9f0001b4a // I add it
         }]
         */

        /* Request beego API server to get images */
        dockerService.getVersion().then(function (version) {
            $scope.version = version;
            dockerService.getImages().then(function (images) {
                $scope.images = images;
            });
        });

        /* Request beego API server to delete image */
        $scope.deleteImage = function (image) {
            var id = image.Id.substring(0, 12);
            dockerService.deleteImage(image).then(function (data) {
                alert_success("Delete image " + id);
                dockerService.getImages().then(function (images) {
                    $scope.images = images;
                });
            }, function (reason) {
                alert_error("Delete image " + id);
            });
        };

        $scope.isReadonly = function() {
            if($scope.version && $scope.version.PirateMode !== 'readonly'){
                return false;
            }
            return true;
        }
    }]);

/*
 * Image controller requests beego API server to get image
 * Todo: Remove the duplicated code from ImagesController
 */
seagullControllers.controller('ImageController', ['$scope', '$routeParams', 'dockerService',
    function ($scope, $routeParams, dockerService) {

        /* Refer to https://docs.docker.com/reference/api/docker_remote_api_v1.14/#inspect-an-image
         {
         Architecture: "amd64",
         Author: "tobe tobeg3oogle@gmail.com",
         Comment: "",
         Config: {
         AttachStderr: false,
         AttachStdin: false,
         AttachStdout: false,
         Cmd: [
         "./bin/hbase",
         "master",
         "start"
         ],
         CpuShares: 0,
         Cpuset: "",
         Domainname: "",
         Entrypoint: null,
         Env: [
         "HOME=/",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "JAVA_HOME=/usr/lib/jvm/java-7-oracle/"
         ],
         ExposedPorts: {
         16000/tcp: { },
         16010/tcp: { },
         16020/tcp: { },
         16030/tcp: { },
         2181/tcp: { }
         },
         Hostname: "b756a5b3138f",
         Image: "c207d0b37af7b71ad611e610fe29318c45cf325153aaa2a38dd547b6315cf0cf",
         Memory: 0,
         MemorySwap: 0,
         NetworkDisabled: false,
         OnBuild: [ ],
         OpenStdin: false,
         PortSpecs: null,
         StdinOnce: false,
         Tty: false,
         User: "",
         Volumes: null,
         WorkingDir: "/opt/hbase"
         },
         Container: "cc03ae59eb372918c611a97f4b8fe585a41c1004a330c87f72ad5aeaac5ffe7a",
         ContainerConfig: {
         AttachStderr: false,
         AttachStdin: false,
         AttachStdout: false,
         Cmd: [
         "/bin/sh",
         "-c",
         "#(nop) CMD [./bin/hbase master start]"
         ],
         CpuShares: 0,
         Cpuset: "",
         Domainname: "",
         Entrypoint: null,
         Env: [
         "HOME=/",
         "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
         "JAVA_HOME=/usr/lib/jvm/java-7-oracle/"
         ],
         ExposedPorts: {
         16000/tcp: { },
         16010/tcp: { },
         16020/tcp: { },
         16030/tcp: { },
         2181/tcp: { }
         },
         Hostname: "b756a5b3138f",
         Image: "c207d0b37af7b71ad611e610fe29318c45cf325153aaa2a38dd547b6315cf0cf",
         Memory: 0,
         MemorySwap: 0,
         NetworkDisabled: false,
         OnBuild: [ ],
         OpenStdin: false,
         PortSpecs: null,
         StdinOnce: false,
         Tty: false,
         User: "",
         Volumes: null,
         WorkingDir: "/opt/hbase"
         },
         Created: "2014-09-02T01:47:04.08306725Z",
         DockerVersion: "1.1.2",
         Id: "fd175444c76df6a70aa6453dc448d6fac907f201dc8bb712e9f68d26d9312241",
         Os: "linux",
         Parent: "c207d0b37af7b71ad611e610fe29318c45cf325153aaa2a38dd547b6315cf0cf",
         Size: 0
         }
         */

        /* Request beego API server to get image */
        if (typeof $routeParams.id === 'undefined' || $routeParams.id == null) {
            dockerService.getImageByUserAndRepo($routeParams.user, $routeParams.repo).then(function (image) {
                $scope.image = image;
            });
        } else {
            dockerService.getImageById($routeParams.id).then(function (image) {
                $scope.image = image;
            });
        }

    }]);

/* Contaienrs controller requests beego API server to get configuration */
seagullControllers.controller('ConfigurationController', ['$scope', '$routeParams', 'dockerService',
    function ($scope, $routeParams, dockerService) {

        /* Refer to https://docs.docker.com/reference/api/docker_remote_api_v1.14/#show-the-docker-version-information
         {
         "ApiVersion":"1.12",
         "Version":"0.2.2",
         "GitCommit":"5a2a5cc+CHANGES",
         "GoVersion":"go1.0.3"
         }
         */

        /* Refer to https://docs.docker.com/reference/api/docker_remote_api_v1.14/#display-system-wide-information
         {
         "Containers":11,
         "Images":16,
         "Driver":"btrfs",
         "DriverStatus": [ // I add it
         [
         "Root Dir",
         "/var/lib/docker/aufs"
         ],[
         "Dirs",
         "544"
         ]
         ],
         "ExecutionDriver":"native-0.1",
         "KernelVersion":"3.12.0-1-amd64"
         "Debug":false,
         "NFd": 11,
         "NGoroutines":21,
         "NEventsListener":0,
         "InitPath":"/usr/bin/docker",
         "InitSha1": "", // I add it
         "IndexServerAddress": "https://index.docker.io/v1/", // I edit it
         "MemoryLimit":true,
         "SwapLimit":false,
         "IPv4Forwarding":true
         "Sockets": [
         "unix:///var/run/docker.sock" // I add it
         ],
         }
         */

        /* Request beego API server to get the version object */
        dockerService.getVersion().then(function (version) {
            $scope.version = version;
        });

        /* Request beego API server to get the info object */
        dockerService.getInfo().then(function (info) {
            $scope.info = info;
        });

    }]);

/* Dockerhub controller requests beego API server to get search images */
seagullControllers.controller('DockerhubController', ['$scope', '$routeParams', 'dockerService',
    function ($scope, $routeParams, dockerService) {

        /*
         [{
         description: "Friendly Web UI to monitor docker daemon",
         is_official: false,
         is_trusted: true,
         name: "tobegit3hub/seagull",
         star_count: 1
         }]
         */

        /* Display the loading icon before get search images */
        $scope.isSearching = true;

        /* Request beego API server to get search images, default is seagull */
        dockerService.searchImages('seagull').then(function (images) {
            $scope.isSearching = false;
            $scope.images = images;
        });

        /* Request beego API server to get search images */
        $scope.getSearchImages = function (term) {
            $scope.isSearching = true;

            dockerService.searchImages(term).then(function (images) {
                $scope.isSearching = false;
                $scope.images = images;
                alert_success("Search images of " + term);
            }, function (reason) {
                $scope.isSearching = false;
                alert_error("Search images of " + term);
            });
        };

        /* Generate the image link by judging it's official images or not */
        $scope.getImageLink = function (name) {
            var address;

            if (name.indexOf('/') === -1) {
                // Example: https://registry.hub.docker.com/_/golang
                address = "https://registry.hub.docker.com/_/" + name;
            } else {
                // Example: https://registry.hub.docker.com/u/tobegit3hub/seagull
                address = "https://registry.hub.docker.com/u/" + name;
            }

            return address;
        };

    }]);
