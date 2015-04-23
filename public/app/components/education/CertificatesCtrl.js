'use strict';
/* Controller */

App.controller('CertificatesCtrl', ['$scope', '$http', '$userInfo', 'UtilsService',
    function($scope, $http, $userInfo, UtilsService) {

        var formats = ['MM', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
            format = formats[0],
            certificateCounter = 0;

        this.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.certificates) ) {
            var promiseGetCertificates = $userInfo.getUserCertificates();
            promiseGetCertificates.then(function (onFulfilled) {
                $scope.certificates = UtilsService.convertDate(onFulfilled) || [{}];
            }, function (onReject) {
                $scope.certificates = [{}];
            });
        };
        $scope.certificate = {};
        $scope.certificates = $userInfo.certificates || [{}];
        $scope.addCertificate = function () {
            var certificateTemplate = {
                id: certificateCounter
            };
            certificateCounter += 1;
            $scope.certificates.push(certificateTemplate);
        };
        $scope.selectorYears = UtilsService.generateYears();
        $scope.removeCertificate = function(obj) {
            angular.forEach($scope.certificates, function(elem, index) {
                // if user added a form that not saved on the server yet, just delete UI
                if ($userInfo.certificates.length != $scope.certificates.length &&
                    $scope.certificates[index]['id'] == obj['id']) {
                    $scope.certificates.splice(index, 1);
                    return;
                }
                if ( $scope.certificates[index]['id'] == obj['id'] ) {
                    $http({
                        method: 'DELETE',
                        url: '/lawyers/certificates/' + obj['id'],
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    }).
                        success(function (data, status, headers, config) {
                            $scope.certificates.splice(index, 1);
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = 'Unexpected error. Please try again later.';
                        });
                }
            })
        };

        $scope.updateCertificates = function (object) {
            var copyObject = angular.copy(object);
            copyObject = UtilsService.convertDate(copyObject, formats[1] ); // helps to avoid overwriting of UI
            // The server generates hash ID for saved forms,
            // if new form is added from UI and the ID starts from 0 (means that id is not saved on the server )
            var method = isFinite(object.id) || !object.id ? 'POST' : 'PUT',
                url = method == 'POST' ? '/lawyers/certificates' : '/lawyers/certificates/' + object.id;

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