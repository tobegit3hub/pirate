var seagullServices = angular.module('seagullServices', []);

/* Docker service requests beego API server */
seagullServices.service('dockerService', ['$http', '$q',
    function ($http, $q) {
        var baseURL = '/dockerapi/';
        var getVersionURI = baseURL + 'version';
        var getInfoURI = baseURL + 'info';
        var getImagesURI = baseURL + "images";
        var getImageBaseURI = baseURL + 'images/';
        var searchImagesURI = baseURL + 'images/search';

        function getDataForURI(uri, params) {
            var deferred = $q.defer();
            var query = params ? '?' + params : "";
            var url = uri + query;
            $http.get(url).success(function (data) {
                deferred.resolve(data);
            }).error(function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        function deleteDataForURI(uri, params){
            var deferred = $q.defer();
            var query = params ? '?' + params : "";
            var url = uri + query;
            $http.delete(url).success(function (data) {
                deferred.resolve(data);
            }).error(function (reason) {
                deferred.reject(reason);
            });
            return deferred.promise;
        }

        function getVersion() {
            return getDataForURI(getVersionURI);
        }

        function getInfo() {
            return getDataForURI(getInfoURI);
        }

        function getImages() {
            return getDataForURI(getImagesURI);
        }

        function getImageTags(user, image) {
            url = "/dockerapi/" + user + "/" + image + "/tags/list"
            return getDataForURI(url)
        }

        function getLibraryImageTags(image) {
            //return getDataForURI(getImagesURI)
            url = "/dockerapi/" + image + "/tags/list"
            return getDataForURI(url)
        }

        function getImageById(id) {
            return getDataForURI(getImageBaseURI + id + '/json');
        }

        function getImageByUserAndRepo(user, repo) {
            return getDataForURI(getImageBaseURI + user + "/" + repo + '/json');
        }

        function getImageInfo(id, name, tag) {
            return getDataForURI(getImageBaseURI +'info?id=' + id + "&name=" + name + "&tag=" + tag);
        }

        function searchImages(term) {
            return getDataForURI(searchImagesURI, "term=" + term);
        }

        function deleteImage(image) {
            var name = image.Name;
            var tag = image.Tag;
            var uri = baseURL + 'repositories/' + name + '/tags/' + tag;
            return deleteDataForURI(uri);
        }

        return {
            getVersion: getVersion,
            getInfo: getInfo,
            getImages: getImages,
            getImageTags: getImageTags,
            getLibraryImageTags: getLibraryImageTags,
            getImageById: getImageById,
            getImageByUserAndRepo: getImageByUserAndRepo,
            getImageInfo: getImageInfo,
            deleteImage: deleteImage,
            searchImages: searchImages
        }

    }]);