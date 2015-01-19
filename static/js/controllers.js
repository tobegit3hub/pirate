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
            $scope.GoVersion = version.GoVersion;
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
seagullControllers.controller('ImagesController', ['$scope', '$routeParams', '$http', 'dockerService', '$modal',
    function ($scope, $routeParams, $http, dockerService, $modal) {

        dockerService.getVersion().then(function (version) {
            $scope.version = version;
            dockerService.getImages().then(function (images) {
                $scope.images = images;
            });
        });

        $scope.pullImage = function (image) {
            if ($scope.version) {
                $scope.pullUrl = $scope.version.PirateUrlAlias + "/" + image.Name + "/" + image.Tag;
                var modalInstance = $modal.open({
                    templateUrl: '/static/html/modal.html',
                    controller: 'ModalController',
                    resolve: {
                        pullUrl: function () {
                            return $scope.pullUrl;
                        }
                    }
                });

                modalInstance.result.then(function () {
                }, function () {
                });
            }
        };

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

        $scope.isReadonly = function () {
            if ($scope.version && $scope.version.PirateMode !== 'readonly') {
                return false;
            }
            return true;
        }
    }]);

/*
 * Modal controller
 */
seagullControllers.controller('ModalController', [
    '$scope',
    '$modalInstance',
    'pullUrl',
    function ($scope, $modalInstance, pullUrl) {
        $scope.pullCmd = "docker pull " + pullUrl;
        $scope.close = function () {
            $modalInstance.close();
        }
    }]);

/*
 * Image controller requests beego API server to get image
 */
seagullControllers.controller('ImageController', ['$scope', '$routeParams', 'dockerService',
    function ($scope, $routeParams, dockerService) {

        function getImageInfo(image) {
            dockerService.getImageInfo(image.id).then(function (info) {
                $scope.mdInfo = info.Comment;
            });
        }

        if (typeof $routeParams.id === 'undefined' || $routeParams.id == null) {
            dockerService.getImageByUserAndRepo($routeParams.user, $routeParams.repo).then(function (image) {
                $scope.image = image;
                getImageInfo(image);
            });
        } else {
            dockerService.getImageById($routeParams.id).then(function (image) {
                $scope.image = image;
                getImageInfo(image);
            });
        }

    }]);

/* Contaienrs controller requests beego API server to get configuration */
seagullControllers.controller('ConfigurationController', ['$scope', '$routeParams', 'dockerService',
    function ($scope, $routeParams, dockerService) {

        dockerService.getVersion().then(function (version) {
            $scope.version = version;
        });

        dockerService.getInfo().then(function (info) {
            $scope.info = info;
        });

    }]);

/* Dockerhub controller requests beego API server to get search images */
seagullControllers.controller('DockerhubController', ['$scope', '$routeParams', 'dockerService',
    function ($scope, $routeParams, dockerService) {

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
