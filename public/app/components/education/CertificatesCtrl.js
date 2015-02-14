'use strict';
/* Controller */

App.controller('CertificatesCtrl', ['$scope', '$http', '$userInfo', function($scope, $http, $userInfo) {

    // if data had saved before, do not send a request
    if ( _.isEmpty($userInfo.certificates) ) {
        var promiseGetCertificates = $userInfo.getUserUniversity();
        promiseGetCertificates.then(function (onFulfilled) {
            $scope.education.certificates = onFulfilled || [];
        }, function (onReject) {
            $scope.education.certificates = [];
        });
    };
    $scope.education = {};
    $scope.education.certificates = $userInfo.certificates || [];

    $scope.updateCertificates = function (certificateData) {
        certificateData.date = moment(certificateData.date).format($scope.formats[1]);
        $http({
            method: 'POST',
            url: '/lawyers/education/certificates',
            data: certificateData,
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
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        minMode: 'month'
    };

    $scope.formats = ['MM', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

}]);