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
                $scope.pullUrl = $scope.version.PirateUrlAlias + "/" + image.Name + ":" + image.Tag;
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

        function mapToList(map){
            var list = [];
            for (var name in map) {
                list.push({
                    Name: name,
                    Value: map[name]
                });
            }
            return list;
        }

        dockerService.getVersion().then(function (version) {
            $scope.version = version;
            dockerService.getImageInfo($routeParams.id, $routeParams.name, $routeParams.tag).then(function (image) {
                var createTime = Date.parse(image.Created.replace(/"/g, ''));
                image.Created = createTime;
                $scope.image = image;
                $scope.pullUrl = "docker pull " + $scope.version.PirateUrlAlias + "/" + image.Name + ":" + image.Tag;
                $scope.mdInfo = image.Readme;
                $scope.txtDockerfile = image.Dockerfile;
                $scope.txtTag = image.Tags;
                $scope.txtLayers = image.Layers;
                $scope.tags = mapToList(image.Tags);
                $scope.layers = image.Layers;
                $scope.metadata = mapToList(image.Pirate);
            });
        });
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
