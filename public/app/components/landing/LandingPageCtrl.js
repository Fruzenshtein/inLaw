'use strict';
/* Controller */

App.controller('LandingPageCtrl', ['$scope', '$http', '$userInfo', '$timeout',
    function ($scope, $http, $userInfo) {

    $scope.isLoggedIn = $userInfo.isLoggedIn;


    }]);