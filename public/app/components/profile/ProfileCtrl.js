'use strict';
/* Controller */

App.controller('ProfileCtrl', ['$scope', '$http',
    '$filter', '$userInfo', 'ValidationRules', function($scope, $http, $filter, $userInfo, ValidationRules) {
        var localCopyOfProfile;
        // if data saved before do not send request
        if ( _.isEmpty($userInfo.profile) ) {
            var promiseGetProfile = $userInfo.getUserProfile();
            promiseGetProfile.then(function (onFulfilled) {
                $scope.userProfile = onFulfilled || {};
                getGenderObject(onFulfilled); // rewrite Gender to the object
                changeDateFormat();
                // to restore UI
                localCopyOfProfile = angular.copy(onFulfilled);
            }, function (onReject) {
                $scope.userProfile = {};
            });
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
        var format = $scope.formats[2];
        $scope.error = false;
        $scope.isUpdated = false;

        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        $scope.userProfile =  $userInfo.profile || {};
        $scope.birthDate = {};
        function changeDateFormat() {
            $scope.birthDate.day = $scope.userProfile.birthDate
                ? moment($scope.userProfile.birthDate).format('DD')
                : undefined;
            $scope.birthDate.month = $scope.userProfile.birthDate
                ? moment($scope.userProfile.birthDate).format('MMMM')
                : undefined;
            $scope.birthDate.year = $scope.userProfile.birthDate
                ? moment($scope.userProfile.birthDate).format('YYYY')
                : undefined;
        }
        $scope.genderTypes = [ //TODO: get from the server
            { name: 'Чоловіча', id: 'm' },
            { name: 'Жіноча', id: 'f' }
        ];
        $scope.selectorDays = [
            '01','02','03','04','05','06','07','08','09',
            10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        $scope.selectorMonth = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        $scope.selectorYears = generateYears();

        function generateYears(min, max) {
            var min = min || new Date().getFullYear() - 80,
                max = max || new Date().getFullYear(),
                arrayOfYears = [];

            for (var i = min; i <= max; i++) {
                arrayOfYears.push(i);
            };
            return arrayOfYears;
        };

        function getGenderObject(response) {
            angular.forEach($scope.genderTypes, function(elem, index) {
                if (elem['id'] === response['gender']) {
                    $scope.userProfile['gender'] = elem;
                }
            });
        }
        $scope.discardChanges = function () {
            $scope.userProfile = localCopyOfProfile;
        };

        function getStringDate(data) {
            var birthDay;
            if (!($scope.birthDate.day && $scope.birthDate.month && $scope.birthDate.year) ) {
                birthDay = {};
                return birthDay;
            }
            birthDay = $scope.birthDate.day + '/' +
                ($scope.selectorMonth.indexOf($scope.birthDate.month) + 1)+ '/' +
                $scope.birthDate.year;
            return birthDay;
        };

        $scope.updateProfile = function(userProfile) {
            var _userProfile = userProfile;
                _userProfile.gender = _userProfile.gender
                    ? _userProfile.gender['id']
                    : undefined;
                _userProfile.birthDate = getStringDate(_userProfile);

            $http({
                method: 'PUT',
                url: '/lawyers/profile',
                data: _userProfile,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function(data, status, headers, config) {
                    $scope.formStatus.isEditModeOpen = true;
                    $scope.isUpdated = true;
                }).
                error(function(data, status, headers, config) {
                    $scope.error = data.message;
                });
        };
        // *** JQUERY SECTION ***

        // Profile form validation
        (function ($) {
            $('.ui.form')
                .form(ValidationRules.uk);
        })(jQuery);

}]);
