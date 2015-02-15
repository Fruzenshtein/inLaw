'use strict';
/* Controller */

App.controller('ExperienceCtrl', ['$scope', '$http', '$userInfo',
    function ($scope, $http, $userInfo) {

        // if data had been saved before, do not send a request
        if ( _.isEmpty($userInfo.experiences) ) {
            var promiseGetExperience = $userInfo.getUserExperience();
            promiseGetExperience.then(function (onFulfilled) {
                $scope.experiences = onFulfilled || [];
            }, function (onReject) {
                $scope.experiences = [];
            });
        };

        $scope.experience = {};
        $scope.experiences = $userInfo.experiences || [];
        $scope.experiencesCounter = 0;
        $scope.addExperience = function () {
            $scope.experiencesTemplate = {
                id: $scope.experiencesCounter
            };
            $scope.experiencesCounter += 1;
            $scope.experiences.push($scope.experiencesTemplate);
        };

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
            this.openedEnd = false;
            this.openedStart = true;
        };
        $scope.openEnd = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.openedStart = false;
            this.openedEnd = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            minMode: 'month'
        };

        $scope.formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        $scope.updateExperience = function (experienceData) {
            experienceData.startDate = moment(experienceData.startDate).format($scope.formats[1]);
            experienceData.endDate = moment(experienceData.endDate).format($scope.formats[1]);
            console.log(experienceData);
            $http({
                method: 'POST',
                url: '/lawyers/experience',
                data: experienceData,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function (data, status, headers, config) {
                    $scope.formStatus.isEditModeOpen = true;
                    $scope.isUpdated = true;
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        };
}]);