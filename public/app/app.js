'use strict';

// Declare app level module which depends on filters, and services
var App = angular.module('App', ['ui.router'])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/"); // root route

        $stateProvider.state('main', {
            url: '/',
            views: {
                "test": {
                    templateUrl: 'assets/partials/noTest.html'
                }
            }
        }).state('testOptions', {
            url: '/tests/:name',
            views: {
                "test": {
                    templateUrl: function ($stateParams){
                        return 'assets/partials/tests/' + $stateParams.name + '.html';
                    },
                    controllerProvider: function ($stateParams){
                        return $stateParams.name + 'Ctrl';
                    }
                },
                "progressBar@testOptions": {
                    templateUrl: 'assets/partials/progressBar.html'
                }
            }
        }).state('testOptions.testResult', {
            url: '/result',
            views: {
                "test@": {
                    templateUrl: 'assets/partials/testResult.html',
                    controllerProvider: function ($stateParams) {
                        return $stateParams.name + 'Ctrl';
                    }
                }
            }
        });

        // Without server side support html5 must be disabled.
        return $locationProvider.html5Mode(false);
    }]);
