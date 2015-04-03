'use strict';
/* Controller */

App.controller('LandingPageCtrl', ['$scope', '$http', '$userInfo', '$rootScope', '$userInfo',
    function ($scope, $http, $userInfo, $rootScope) {

        //For the test needs
    $scope.currentUser = $rootScope.currentUser || $userInfo.isLoggedIn || sessionStorage.getItem('token');


    }]);