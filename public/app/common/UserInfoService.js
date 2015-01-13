'use strict';
/* Services */

App.factory('$userInfo', ['$http','$rootScope', function($http, $rootScope) {

    function authenticate(onSuccess, onError) {
        onSuccess = onSuccess || function() {};
        onError = onError || function() {};

        $http({
            method: '',
            url: ''
        }).
            success(function(data, status, headers, config) {

            }).
            error(function(data, status, headers, config) {

            });
    };

    function getUserInfo(onSuccess, onError) {

    };

    var info = {
        authenticate: authenticate,
        getUserInfo: getUserInfo,
        allowed: false
    };

    return info;
}]);