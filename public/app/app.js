'use strict';

// Declare app level module which depends on filters, and services
var App = angular.module('App', ['ui.router'])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/"); // root route

        $stateProvider.state('landing', {
            url: '/',
            views: {
                "mainView": {
                    "templateUrl": 'assets/app/components/registration/registration.html',
                    "controller": 'RegistrationCtrl'
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
        });

        // Without server side support html5 must be disabled.
        return $locationProvider.html5Mode(false);
    }]);
