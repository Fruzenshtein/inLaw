'use strict';
/* Controller */

App.controller('ContactsCtrl', ['$scope', '$http',
    '$filter', '$userInfo', function($scope, $http, $filter, $userInfo) {

    // if data saved before do not send request
    if ( _.isEmpty($userInfo.contacts) ) {
        var promiseGetProfile = $userInfo.getUserContacts();
        promiseGetProfile.then(function (onFulfilled) {
            $scope.userContacts = onFulfilled || {};
        }, function (onReject) {
            $scope.userContacts = {};
        });
    };
    $scope.userContacts = $userInfo.contacts || {};
    $scope.formStatus = {
        isEditModeOpen: true,
        isEditModeDisabled: false
    };
    $scope.phoneCounter = 0;
    $scope.userContacts.phones = [{
            id: 'phone',
            name: 'Work',
            number: ''
        }
    ];
    $scope.addPhone = function() {
        $scope.phoneTemplate = {
            id: 'phone' + $scope.phoneCounter,
            name: '',
            number: ''
        };
        $scope.phoneCounter += 1;
        $scope.userContacts.phones.push($scope.phoneTemplate);
    };
    $scope.removePhone = function() {
        $scope.phoneCounter -=1;
        $scope.phones.length -=1;
    };
    $scope.updateContacts = function(contacts) {
        $http({
            method: 'PUT',
            url: '/lawyers/contacts',
            data: contacts,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).
            success(function (data, status, headers, config) {
                $scope.formStatus.isEditModeOpen = true;
                $scope.isUpdated = true;
                $scope.error = false;
            }).
            error(function (data, status, headers, config) {
                $scope.error = 'Unexpected error. Please try again later.';
            });
    }
}]);