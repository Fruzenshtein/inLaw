'use strict';
/* Controller */

App.controller('ContactsCtrl', ['$scope', '$http',
    '$filter', '$userInfo', function($scope, $http, $filter, $userInfo) {

    $scope.formStatus = {
        isEditModeOpen: true,
        isEditModeDisabled: false
    };
    $scope.phoneCounter = 0;
    $scope.phones = [{
            id: 'phone',
            name: 'Work',
            phone: ''
        }
    ];
    $scope.addPhone = function() {
        $scope.phoneTemplate = {
            id: 'phone' + $scope.phoneCounter,
            name: '',
            phone: ''
        };
        $scope.phoneCounter += 1;
        $scope.phones.push($scope.phoneTemplate);
    };
    $scope.removePhone = function() {
        $scope.phoneCounter -=1;
        $scope.phones.length -=1;
    };

}]);