'use strict';
/* Controller */

// The controller injected directly into html, avoiding routers
App.controller('HeaderCtrl', ['$scope', '$rootScope', '$http', '$userInfo',
    function ($scope, $rootScope, $http, $userInfo) {

        $rootScope.currentUser = $rootScope.currentUser
            || $userInfo.isLoggedIn
            || sessionStorage.getItem('token');

    }]);