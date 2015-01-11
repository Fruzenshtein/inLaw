'use strict';

App.controller('RegistrationCtrl',['$scope', function($scope) {
    $scope.signUp = {
        'email': '',
        'password': '',
        'cpassword': ''
    };
}]);