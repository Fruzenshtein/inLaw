'use strict';

// Declare app level module which depends on filters, and services
var App = angular.module('App', ['ui.router', 'ui.bootstrap', 'ui.select', 'ngSanitize'])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/"); // root route

        $stateProvider.state('landing', {
            url: '/',
            views: {
                "mainView": {
                    "templateUrl": 'assets/devbuild/assets/components/landing/landing.html',
                    "controller": 'LandingPageCtrl'
                }
            }
        }).state('registration', {
            url: "/registration",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/registration/registration.html',
                    controller: 'RegistrationCtrl'
                }
            }
        }).state('login', {
            url: "/login",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/login/login.html',
                    controller: 'LoginCtrl'
                }
            }
        }).state('profile', {
            url: "/profile",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/profile/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        }).state('contacts', {
            url: "/contacts",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/contacts/contacts.html',
                    controller: 'ContactsCtrl'
                }
            }
        }).state('education', {
            url: "/education",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/education/education.html'
                },
                "universities@education": {
                    templateUrl: 'assets/devbuild/assets/components/education/universities.html',
                    controller: 'UniversitiesCtrl'
                },
                "certificates@education": {
                    templateUrl: 'assets/devbuild/assets/components/education/certificates.html',
                    controller: 'CertificatesCtrl'
                },
                "languages@education": {
                    templateUrl: 'assets/devbuild/assets/components/education/languages.html',
                    controller: 'LanguagesCtrl'
                }
            }
        }).state('experience', {
            url: "/experience",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/experience/experience.html',
                    controller: 'ExperienceCtrl'
                }
            }
        }).state('filters', {
            url: "/lawyers/filters",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/filters/filters.html',
                    controller: 'FiltersCtrl'
                }
            }
        }).state('competence', {
            url: "/competences",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/competence/competence.html',
                    controller: 'CompetenceCtrl'
                }
            }
        }).state('publicProfile', {
            url: "/public/:id",
            views: {
                "mainView": {
                    templateUrl: 'assets/devbuild/assets/components/public/publicProfile.html',
                    controller: 'PublicProfileCtrl'
                }
            }
        });
        // Without server side support html5 must be disabled.
        return $locationProvider.html5Mode(false);
    }]);
