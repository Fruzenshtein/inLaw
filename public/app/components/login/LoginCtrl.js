'use strict';

App.controller('LoginCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {
    $scope.signIn = {};
    $scope.error = false;
    $scope.isLogin = true;

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
                //userinfo.getUserData(); TBD... if appropriate info need to be shown
                sessionStorage.setItem(signIn.email, data['token']);
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