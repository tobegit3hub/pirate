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
                image.Tags2 = {
                    "latest": "9e89cc6f0bc3c38722009fe6857087b486531f9a779a0c17e3ed29dae8f12c4f",
                    "0.1.1":  "b486531f9a779a0c17e3ed29dae8f12c4f9e89cc6f0bc3c38722009fe6857087"
                };
                $scope.tags = mapToList(image.Tags2);
                image.Layers2 = ["088b4502f51920fbd9b7c503e87c7a2c05aa3adc3d35e79c031fa126b403200f",
                    "aeee63968d87c7da4a5cf5d2be6bee4e21bc226fd62273d180a49c96c62e4543",
                    "bfa4c5326bc764280b0863b46a4b20d940bc1897ef9c1dfec060604bdc383280",
                    "6ab5893c6927c15a15665191f2c6cf751f5056d8b95ceee32e43c5e8a3648544"];
                $scope.layers = image.Layers2;
                image.Pirate2 = {
                    "PACKAGE_VERSION": "0.3",
                    "ORGANIZATION": "ERIC"
                };
                $scope.metadata = mapToList(image.Pirate2);
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
