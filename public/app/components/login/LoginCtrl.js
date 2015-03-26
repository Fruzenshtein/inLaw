'use strict';

App.controller('LoginCtrl', ['$scope', '$state', '$http', '$userInfo',
    function($scope, $state, $http, $userInfo) {

    $scope.signIn = {};
    $scope.error = false;

    $scope.submit = function(signIn) {
        var data = {
            'email': signIn.email,
            'password': signIn.password
        };
        $http({
            method: 'POST',
            url: '/auth/login',
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).
            success(function(data, status, headers, config) {
                sessionStorage.setItem('token', data['token']);
                $userInfo.setUserStatus(true);
                $state.go('landing');
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
    };

    $scope.cleanError = function() {
        this.error = false;
    };


}]);