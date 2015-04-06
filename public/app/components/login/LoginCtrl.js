'use strict';

App.controller('LoginCtrl', ['$scope', '$state', '$http', '$userInfo', 'AuthService', '$rootScope',
    function($scope, $state, $http, $userInfo, AuthService, $rootScope) {

    $scope.signIn = {};
    $scope.error = false;
    $scope.submit = function(signIn) {
        AuthService.login(signIn)
            .success(function(data, status, headers, config) {
                $rootScope.currentUser = data['token'];
                AuthService.setCurrentUser(data['token']);
                $state.go('landing');
        })
            .error(function(data, status, headers, config) {
                $scope.error = true;
        });
    };

}]);