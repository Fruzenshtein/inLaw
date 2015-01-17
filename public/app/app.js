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
