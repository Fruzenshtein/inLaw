'use strict';

App.controller('RegistrationCtrl',['$scope', '$state', '$http', '$userInfo', 'ValidationRules',
    function($scope, $state, $http, $userInfo, ValidationRules) {

        $scope.signUp = {};
        $scope.error = false;
        $scope.loading = false;

        $scope.submit = function(signUp) {
            var data = {
                "email": signUp.email,
                "password": signUp.password,
                "repeatPassword": signUp.cpassword
            };
            $scope.loading = true;

            $http({
                method: 'POST',
                url: '/lawyers',
                data: data,
                headers: {'Content-Type': 'application/json'}
            }).
                success(function(data, status, headers, config) {
                    sessionStorage.setItem('token', data.token);
                    $userInfo.setUserStatus(true);
                    $state.go('myAccount');
                }).
                error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $scope.error = data.message;
                });
        };

        $scope.cleanError = function() {
            this.error = false;
        };

        // *** JQUERY SECTION ***
        // Activate checkbox
        $('.ui.checkbox').checkbox();
        // Registration form validation
        (function ($) {
            $('.ui.form')
                .form(ValidationRules.en);
        })(jQuery);


    }]);