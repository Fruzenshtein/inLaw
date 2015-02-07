'use strict';
/* Controller */

App.controller('UniversitiesCtrl', ['$scope', function ($scope) {

    $scope.university = {};
    $scope.university.startDate = '';
    $scope.university.endDate = '';

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        var years100ago = new Date();
        // Time 100 years ago
        years100ago.setTime(years100ago.valueOf() - 100 * 365 * 24 * 60 * 60 * 1000);
        $scope.minDate = $scope.minDate ? null : new Date(years100ago);
    };
    $scope.toggleMin();
    $scope.maxDate = new Date();
    $scope.openStart = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedEnd = false;
        $scope.openedStart = true;
    };
    $scope.openEnd = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart = false;
        $scope.openedEnd = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        minMode: 'year'
    };

    $scope.formats = ['yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.addEducation = function() {

    };

    $scope.updateProfile = function(userProfile) {

        $http({
            method: 'POST',
            url: '/lawyers/education/universities',
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