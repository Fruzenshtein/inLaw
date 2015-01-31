'use strict';
/* Controller */

App.controller('ProfileCtrl', ['$scope', '$http',
    '$filter', '$userInfo', function($scope, $http, $filter, $userInfo) {
    // if data saved before do not send request
    if ( _.isEmpty($userInfo.profile) ) {
        var promiseGetProfile = $userInfo.getUserProfile();
        promiseGetProfile.then(function (onFulfilled) {
            $scope.userProfile = onFulfilled || {};
        }, function (onReject) {
            $scope.userProfile = {};
        });
    };
    $scope.error = false;
    $scope.isUpdated = false;

    $scope.formStatus = {
        isEditModeOpen: true,
        isEditModeDisabled: false
    };

    $scope.today = function() {
        $scope.userProfile =  $userInfo.profile || {}; // fists initialization starts here, from function
        $scope.userProfile.birthDate = $filter('date')($userInfo.profile.birthDate, $scope.format) || +new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.userProfile.birthDate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.maxDate = new Date();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        "formatYear": "yy",
        "show-button-bar": false,
        "startingDay": 0
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    $scope.updateProfile = function(userProfile) {
        var _profileData = {
            "gender": userProfile.gender,
            "firstName": userProfile.firstName,
            "lastName": userProfile.lastName,
            "middleName": userProfile.middleName,
            "birthDate": $filter('date')(userProfile.birthDate, $scope.format),
            "minRate": userProfile.minRate
        };
        $http({
            method: 'PUT',
            url: '/lawyers/profile',
            data: _profileData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).
            success(function(data, status, headers, config) {
                //UserInfoService.getUserData(); TBD... if appropriate info need to be shown
                $scope.formStatus.isEditModeOpen = true;
                $scope.isUpdated = true;
            }).
            error(function(data, status, headers, config) {
                $scope.error = 'Unexpected error. Please try again later.';
            });
    };

}]);
