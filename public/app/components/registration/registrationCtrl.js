'use strict';

App.controller('RegistrationCtrl',['$scope', '$state', '$http', '$userInfo',
    function($scope, $state, $http, $userInfo) {

    $scope.signUp = {};

    $scope.submit = function(signUp) {
        var data = {
            "email": signUp.email,
            "password": signUp.password,
            "repeatPassword": signUp.cpassword
        };

        $http({
            method: 'POST',
            url: '/lawyers',
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).
            success(function(data, status, headers, config) {
                sessionStorage.setItem('token', data.token);
                $userInfo.setUserStatus(true);
                $state.go('landing');
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
                status == 400 ? $scope.commonError = data.message :
                    $scope.commonError = 'Unexpected error. Please try again later.'
            });
    };

    $scope.cleanError = function() {
        this.error = false;
    };

}]);