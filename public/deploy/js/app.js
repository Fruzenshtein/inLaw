'use strict';

// Declare app level module which depends on filters, and services
var App = angular.module('App', ['ui.router', 'ui.bootstrap']) //'ui.bootstrap', 'ui.select', 'ngSanitize'
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/"); // root route

        $stateProvider.state('landing', {
            url: '/',
            views: {
                "mainView": {
                    "templateUrl": 'assets/app/components/landing/landing.html'
                }
            }
        }).state('registration', {
            url: "/registration",
            views: {
                "mainView": {
                    templateUrl: 'assets/app/components/registration/registration.html',
                    controller: 'RegistrationCtrl'
                }
            }
        }).state('login', {
            url: "/login",
            views: {
                "mainView": {
                    templateUrl: 'assets/app/components/login/login.html',
                    controller: 'LoginCtrl'
                }
            }
        }).state('profile', {
            url: "/profile",
            views: {
                "mainView": {
                    templateUrl: 'assets/app/components/profile/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        });

        // Without server side support html5 must be disabled.
        return $locationProvider.html5Mode(false);
    }]);

'use strict';
/* Services */

App.factory('$userInfo', ['$http','$rootScope', function($http, $rootScope) {

    function authenticate(onSuccess, onError) {
        onSuccess = onSuccess || function() {};
        onError = onError || function() {};

        $http({
            method: '',
            url: ''
        }).
            success(function(data, status, headers, config) {

            }).
            error(function(data, status, headers, config) {

            });
    };

    function getUserInfo(onSuccess, onError) {

    };

    var info = {
        authenticate: authenticate,
        getUserInfo: getUserInfo,
        allowed: false
    };

    return info;
}]);
'use strict';

App.controller('LoginCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {
    $scope.signIn = {};
    $scope.error = false;
    $scope.isLogin = true;

    $scope.submit = function(signIn) {
        var data = {
            'email': signIn.email,
            'password': signIn.password
        };
        $http({
            method: 'POST',
            url: '/auth/login',
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).
            success(function(data, status, headers, config) {
                //UserInfoService.getUserData(); TBD... if appropriate info need to be shown
                sessionStorage.setItem('token', data['token']);
                $state.go('landing');
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
            });
    };

    $scope.cleanError = function() {
        this.error = false;
    };


}]);
'use strict';

App.controller('ProfileCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
    $scope.userProfile = {};
    $scope.error = false;
    $scope.isUpdated = false;

    $scope.formStatus = {
        isEditModeOpen: true,
        isEditModeDisabled: false
    };

    $scope.today = function() {
        $scope.userProfile.dt = +new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.userProfile.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.maxDate = new Date();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        "formatYear": "yy",
        "show-button-bar": false,
        "startingDay": 0
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    $scope.updateProfile = function(userProfile) {
        var _profileData = {
            "gender": userProfile.gender,
            "firstName": userProfile.firstName,
            "lastName": userProfile.lastName,
            "middleName": userProfile.middleName,
            "birthDate": $filter('date')(userProfile.dt, $scope.format),
            "minRate": userProfile.minRate
        };
        $http({
            method: 'PUT',
            url: '/lawyers/profile',
            data: _profileData,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).
            success(function(data, status, headers, config) {
                //UserInfoService.getUserData(); TBD... if appropriate info need to be shown
                $scope.formStatus.isEditModeOpen = true;
                $scope.isUpdated = true;
            }).
            error(function(data, status, headers, config) {
                $scope.error = 'Unexpected error. Please try again later.';
            });
    };



}]);

'use strict';

App.controller('RegistrationCtrl',['$scope', '$state', '$http', function($scope, $state, $http) {
    $scope.signUp = {};

    $scope.submit = function(signUp) {
        var data = {
            "email": signUp.email,
            "password": signUp.password,
            "repeatPassword": signUp.cpassword
        };

        $http({
            method: 'POST',
            url: '/lawyers',
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).
            success(function(data, status, headers, config) {
                //userinfo.getUserData(); TBD... if appropriate info need to be shown
                sessionStorage.setItem(signUp.email, data.token);
                $state.go('landing');
            }).
            error(function(data, status, headers, config) {
                $scope.error = true;
                status == 400 ? $scope.commonError = data.message :
                    $scope.commonError = 'Unexpected error. Please try again later.'
            });
    };

    $scope.cleanError = function() {
        this.error = false;
    };

}]);