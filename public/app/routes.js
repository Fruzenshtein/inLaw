'use strict';

// Declare app level module which depends on filters, and services
var App = angular.module('App', ['ui.router', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'ngSlider'])
    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/"); // root route

      $stateProvider.state('myAccount', {
        url: '/myAccount',
        views: {
          "mainView": {
            "templateUrl": 'assets/build/assets/components/myAccount/myAccount.html',
            "controller": 'LandingPageCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('homePage', {
        url: "/",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/home/home.html',
            controller: 'HomeCtrl'
          }
        },
        data: {
          requireLogin: false
        }
      }).state('registration', {
        url: "/registration",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/registration/registration.html',
            controller: 'RegistrationCtrl'
          }
        },
        data: {
          requireLogin: false
        }
      }).state('login', {
        url: "/login",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/login/login.html',
            controller: 'LoginCtrl'
          }
        },
        data: {
          requireLogin: false
        }
      }).state('profile', {
        url: "/profile",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/profile/profile.html',
            controller: 'ProfileCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('contacts', {
        url: "/contacts",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/contacts/contacts.html',
            controller: 'ContactsCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('education', {
        url: "/education",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/education/education.html'
          },
          "universities@education": {
            templateUrl: 'assets/build/assets/components/education/universities.html',
            controller: 'UniversitiesCtrl'
          },
          "certificates@education": {
            templateUrl: 'assets/build/assets/components/education/certificates.html',
            controller: 'CertificatesCtrl'
          },
          "languages@education": {
            templateUrl: 'assets/build/assets/components/education/languages.html',
            controller: 'LanguagesCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('experience', {
        url: "/experience",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/experience/experience.html',
            controller: 'ExperienceCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('filters', {
        url: "/lawyers/filters",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/filters/filters.html',
            controller: 'FiltersCtrl'
          }
        },
        data: {
          requireLogin: false
        }
      }).state('competence', {
        url: "/competences",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/competence/competence.html',
            controller: 'CompetenceCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('publicProfile', {
        url: "/public/:id",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/public/publicProfile.html',
            controller: 'PublicProfileCtrl'
          }
        },
        data: {
          requireLogin: false
        }
      }).state('marketPlaceLawyerView', {
        url: "/legal-services",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/marketPlace/marketPlaceList.html',
            controller: 'MarketPlaceLawyerCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('marketPlaceLawyerView.marketPlaceLawyerCreate', {
        url: "/step1",
        views: {
          "mainView@": {
            templateUrl: 'assets/build/assets/components/marketPlace/marketPlace.html'
          },
          "marketPlace@marketPlaceLawyerView.marketPlaceLawyerCreate": {
            templateUrl: 'assets/build/assets/components/marketPlace/marketPlaceGeneral.html'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('marketPlaceLawyerView.marketPlaceLawyerDetail', {
        url: "/step2",
        views: {
          "mainView@": {
            templateUrl: 'assets/build/assets/components/marketPlace/marketPlace.html'
          },
          "marketPlace@marketPlaceLawyerView.marketPlaceLawyerDetail": {
            templateUrl: 'assets/build/assets/components/marketPlace/marketPlaceDetail.html'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('marketPlaceLawyerView.marketPlaceLawyerConfirm', {
        url: "/step3",
        views: {
          "mainView@": {
            templateUrl: 'assets/build/assets/components/marketPlace/marketPlace.html'
          },
          "marketPlace@marketPlaceLawyerView.marketPlaceLawyerConfirm": {
            templateUrl: 'assets/build/assets/components/marketPlace/marketPlaceConfirm.html'
          }
        },
        data: {
          requireLogin: true
        }
      }).state('marketPlaceLawyerEdit', {
        url: "/legal-services/modify/:id",
        views: {
          "mainView": {
            templateUrl: 'assets/build/assets/components/marketPlace/marketPlaceDetail.html',
            controller: 'MarketPlaceLawyerCtrl'
          }
        },
        data: {
          requireLogin: true
        }
      });
      // Without server side support html5 must be disabled.
      return $locationProvider.html5Mode(false);
    }]);
