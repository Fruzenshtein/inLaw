'use strict';
/* Controller */

App.controller('UniversitiesCtrl', ['$scope', '$http', '$userInfo', 'UtilsService',
    function ($scope, $http, $userInfo, UtilsService) {

        var formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
            format = formats[0],
            universityCounter = 0;

        this.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.universities) ) {
            var promiseGetUniversity = $userInfo.getUserUniversity();
            promiseGetUniversity.then(function (onFulfilled) {
                $scope.universities = UtilsService.convertDate(onFulfilled) || [{}];
            }, function (onReject) {
                $scope.universities = [{}];
            });
        };
        $scope.university = {};
        $scope.universities = $userInfo.universities || [{}];
        $scope.degrees = [
          "master"
        ];
        $scope.selectorYears = UtilsService.generateYears();

        $scope.addUniversity = function () {
            var universityTemplate = {
                id: universityCounter
            };
            universityCounter += 1;
            $scope.universities.push(universityTemplate);
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

        $scope.updateEducation = function (object) {
            var copyObject = angular.copy(object);
            copyObject = UtilsService.convertDate(copyObject, formats[1] ); // helps to avoid overwriting of UI
                // The server generates hash ID for saved forms,
                // if new form is added from UI and the ID starts from 0 (means that id is not saved on the server )
                var method = isFinite(object.id) ? 'POST' : 'PUT',
                    url = method == 'POST' ? '/lawyers/universities' : '/lawyers/universities/' + object.id;
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