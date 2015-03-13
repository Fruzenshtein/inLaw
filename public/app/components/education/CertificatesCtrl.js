'use strict';
/* Controller */

App.controller('CertificatesCtrl', ['$scope', '$http', '$userInfo', function($scope, $http, $userInfo) {

    // if data had saved before, do not send a request
    if ( _.isEmpty($userInfo.certificates) ) {
        var promiseGetCertificates = $userInfo.getUserCertificates();
        promiseGetCertificates.then(function (onFulfilled) {
            $scope.certificates = onFulfilled || [{}];
        }, function (onReject) {
            $scope.certificates = [{}];
        });
    };
    $scope.certificate = {};
    $scope.certificates = $userInfo.certificates || [{}];
    $scope.certificateCounter = 0;
    $scope.addCertificate = function () {
        $scope.certificateTemplate = {
            id: $scope.certificateCounter
        };
        $scope.certificateCounter += 1;
        $scope.certificates.push($scope.certificateTemplate);
    };
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

    $scope.updateCertificates = function (array) {
        angular.forEach(array, function(elem, index) {
            array[index].date = moment(array[index].date).format($scope.formats[1]);
            $http({
                method: 'POST',
                url: '/lawyers/certificates',
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

    $scope.formStatus = {
        isEditModeOpen: true,
        isEditModeDisabled: false
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
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        minMode: 'month'
    };

    $scope.formats = ['MM', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

}]);