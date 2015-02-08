'use strict';
/* Controller */

App.controller('UniversitiesCtrl', ['$scope', '$http', '$userInfo',
    function ($scope, $http, $userInfo) {

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.universities) ) {
            var promiseGetUniversity = $userInfo.getUserUniversity();
            promiseGetUniversity.then(function (onFulfilled) {
                $scope.education.universities = onFulfilled || [];
            }, function (onReject) {
                $scope.education.universities = [];
            });
        };

        // Provides separate scopes for universities
        $scope.education = {};
        $scope.education.universities = $userInfo.universities || [];
        $scope.universityCounter = 0;
        $scope.addUniversity = function () {
            $scope.universityTemplate = {
                id: $scope.universityCounter
            };
            $scope.universityCounter += 1;
            $scope.education.universities.push($scope.universityTemplate);
        };

        //TODO add ability to remove selected University
        /*
         1)
         $scope.removeUniversity = function() {

         };
         2) Add inline validation to HTML
         3) Parse Degree >> master, bachelor, phd
         */

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

        $scope.formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        $scope.updateEducation = function (educationData) {
            educationData.startDate = moment(educationData.startDate).format($scope.formats[1]);
            educationData.endDate = moment(educationData.endDate).format($scope.formats[1]);
            $http({
                method: 'POST',
                url: '/lawyers/education/universities',
                data: educationData,
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