'use strict';

// Declare app level module which depends on filters, and services
var App = angular.module('App', ['ui.router', 'ui.bootstrap', 'restangular', 'ui.select', 'ngSanitize'])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {

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
        }).state('contacts', {
            url: "/contacts",
            views: {
                "mainView": {
                    templateUrl: 'assets/app/components/contacts/contacts.html',
                    controller: 'ContactsCtrl'
                }
            }
        }).state('education', {
            url: "/education",
            views: {
                "mainView": {
                    templateUrl: 'assets/app/components/education/education.html'
                },
                "universities@education": {
                    templateUrl: 'assets/app/components/education/universities.html',
                    controller: 'UniversitiesCtrl'
                },
                "certificates@education": {
                    templateUrl: 'assets/app/components/education/certificates.html',
                    controller: 'CertificatesCtrl'
                }
            }
        }).state('experience', {
            url: "/experience",
            views: {
                "mainView": {
                    templateUrl: 'assets/app/components/experience/experience.html',
                    controller: 'ExperienceCtrl'
                }
            }
        }).state('filters', {
            url: "/lawyers/filters",
            views: {
                "mainView": {
                    templateUrl: 'assets/app/components/filters/filters.html',
                    controller: 'FiltersCtrl'
                }
            }
        });

        // Without server side support html5 must be disabled.
        return $locationProvider.html5Mode(false);
    }]);
