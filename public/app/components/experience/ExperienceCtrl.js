'use strict';
/* Controller */

App.controller('ExperienceCtrl', ['$scope', '$http', '$userInfo', 'UtilsService',
    function ($scope, $http, $userInfo, UtilsService) {

        // if data had been saved before, do not send a request
        if ( _.isEmpty($userInfo.experiences) ) {
            var promiseGetExperience = $userInfo.getUserExperience();
            promiseGetExperience.then(function (onFulfilled) {
                // assign [{}] object if request returns an empty object.
                // [{}] - is used to build default html template
                // extra validation is needed due to another structure of data for the Experiences
                $scope.experiences = ( onFulfilled['workPlaces'] && !_.isEmpty(onFulfilled['workPlaces']) )
                    ? UtilsService.convertDate(onFulfilled['workPlaces'])
                    : [{}];
            }, function (onReject) {
                $scope.experiences = [{}];
            });
        };

        this.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        $scope.experience = {};
        $scope.experiences = $userInfo.experiences || [{}];
        $scope.selectorYears = UtilsService.generateYears();
        var formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
            format = formats[0],
            experiencesCounter = 0;
        $scope.addExperience = function () {
            var experiencesTemplate = {
                id: experiencesCounter
            };
            experiencesCounter += 1;
            $scope.experiences.push(experiencesTemplate);
        };
        $scope.removeExperience = function(obj) {
            angular.forEach($scope.experiences, function(elem, index) {
                // if user added a form that not saved on the server yet, just delete UI
                if ($scope.experiences.length != $scope.experiences.length &&
                    $scope.experiences[index]['id'] == obj['id']) {
                    $scope.experiences.splice(index, 1);
                    return;
                }
                if ( $scope.experiences[index]['id'] == obj['id'] ) {
                    $http({
                        method: 'DELETE',
                        url: '/lawyers/experience/' + obj['id'],
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    }).
                        success(function (data, status, headers, config) {
                            $scope.experiences.splice(index, 1);
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = 'Unexpected error. Please try again later.';
                        });
                }
            })
        };
        $scope.updateExperience = function (object) {
            var copyObject = angular.copy(object);
            copyObject = UtilsService.convertDate(copyObject, formats[1] ); // helps to avoid overwriting of UI
            // The server generates hash ID for saved forms,
            // if new form is added from UI and the ID starts from 0 (means that id is not saved on the server )
            var method = isFinite(object.id) || !object.id ? 'POST' : 'PUT',
                url = method == 'POST' ? '/lawyers/experience' : '/lawyers/experience/' + object.id;
            $http({
                method: method,
                url: url,
                data: copyObject,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function (data, status, headers, config) {
                    $scope.isUpdated = true;
                    $scope.error = false;
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                    $scope.isUpdated = false;
                });

        };
}]);