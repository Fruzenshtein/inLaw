'use strict';
/* Service */

App.factory('AuthService', function ($rootScope, $http) {

    var authService = {};
    authService.login = function(creadentials) {
        return $http({
            method: 'POST',
            url: '/auth/login',
            data: creadentials,
            headers: {'Content-Type': 'application/json'}
        });
    };
    authService.isAuthenticated = function() {
        return sessionStorage.getItem('token');
    };
    authService.setCurrentUser = function(user) {
        sessionStorage.setItem('token', user);
    };

    return authService;

});