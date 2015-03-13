'use strict';
/* Controller */

App.controller('UniversitiesCtrl', ['$scope', '$http', '$userInfo',
    function ($scope, $http, $userInfo) {

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.universities) ) {
            var promiseGetUniversity = $userInfo.getUserUniversity();
            promiseGetUniversity.then(function (onFulfilled) {
                $scope.universities = onFulfilled || [{}];
            }, function (onReject) {
                $scope.universities = [{}];
            });
        };
        $scope.university = {};
        $scope.universities = $userInfo.universities || [{}];
        $scope.universityCounter = 0;
        $scope.addUniversity = function () {
            $scope.universityTemplate = {
                id: $scope.universityCounter
            };
            $scope.universityCounter += 1;
            $scope.universities.push($scope.universityTemplate);
        };
        $scope.removeUniversity = function(obj) {
            angular.forEach($scope.universities, function(elem, index) {
                // if user added a form that not saved on the server yet, just delete UI
                if ($userInfo.universities.length != $scope.universities.length &&
                    $scope.universities[index]['id'] == obj['id']) {
                    $scope.universities.splice(index, 1);
                    return;
                }
                if ( $scope.universities[index]['id'] == obj['id'] ) {
                    $http({
                        method: 'DELETE',
                        url: '/lawyers/universities/' + obj['id'],
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    }).
                        success(function (data, status, headers, config) {
                            $scope.universities.splice(index, 1);
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = 'Unexpected error. Please try again later.';
                        });
                }
            })
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
            minMode: 'year'
        };

        $scope.formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        $scope.updateEducation = function (array) {
            angular.forEach(array, function(elem, index) {
                array[index].startDate = moment(array[index].startDate).format($scope.formats[1]);
                array[index].endDate = moment(array[index].endDate).format($scope.formats[1]);
                // Send one object per time. TBD... improvement is added to API side with ability to send an array
                $http({
                    method: 'POST',
                    url: '/lawyers/universities',
                    data: array[index],
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
            });
        };
    }]);