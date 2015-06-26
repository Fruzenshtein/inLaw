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
            url: "/market",
            views: {
                "mainView": {
                    templateUrl: 'assets/build/assets/components/marketPlace/marketPlaceList.html',
                    controller: 'MarketPlaceLawyerCtrl'
                },
                "wizardBar@marketPlaceLawyer": {
                    templateUrl: 'assets/build/assets/components/marketPlace/wizardBar.html'
                }
            },
            data: {
                requireLogin: true
            }
        }).state('marketPlaceLawyerCreate', {
            url: "/market/create",
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

'use strict';
/*  App block */

App.run(function ($rootScope, $state, AuthService) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin,
            currentUser = $rootScope.currentUser || AuthService.isAuthenticated();

        if ( requireLogin && !currentUser ) {
            $state.go('login');
        };

    });

});

App.config(function ($httpProvider) {

    $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
        var $http, $state;

        // this trick must be done so that we don't receive
        // `Uncaught Error: [$injector:cdep] Circular dependency found`
        $timeout(function () {
            $http = $injector.get('$http');
            $state = $injector.get('$state');
        });

        return {
            responseError: function (rejection) {
                var deferred = $q.defer();
                if (rejection.status == 401) {
                    $state.go('login');
                };
                deferred.reject(rejection);
                return deferred.promise;
            }
        };

    });

});

'use strict';
/* Service */

App.factory('AuthService', function ($rootScope, $http) {

    var authService = {};
    authService.login = function(creadentials) {
        return $http({
            method: 'POST',
            url: '/auth/login',
            data: creadentials,
            headers: {'Content-Type': 'application/json'}
        });
    };
    authService.isAuthenticated = function() {
        return sessionStorage.getItem('token');
    };
    authService.setCurrentUser = function(user) {
        sessionStorage.setItem('token', user);
    };

    return authService;

});
'use strict';
/* Services */

App.factory('$filterService', ['$http', '$state', '$q',
    function( $http, $state ) {

        var listOfFoundLawyers = [],
            selectedLawyerID = '',
            selectedLawyerObj = {};

        function saveFoundLawyers(array) {
            if (_.isArray(array) && _.isEmpty(array)) return;
            listOfFoundLawyers = array;
        };
        function saveSelectedLawyer(lawyerID) {
            selectedLawyerID = lawyerID.id;
        };
        function getSelectedLawyerObj() {
            angular.forEach(listOfFoundLawyers, function(elem, index) {
                if (selectedLawyerID === elem['id']) {
                    selectedLawyerObj = elem;
                }
            });
            return selectedLawyerObj;
        };

        return {
            selectedLawyerObj    : selectedLawyerObj,
            listOfFoundLawyers   : listOfFoundLawyers,
            saveFoundLawyers     : saveFoundLawyers,
            saveSelectedLawyer   : saveSelectedLawyer,
            getSelectedLawyerObj : getSelectedLawyerObj
        }

    }]);
'use strict';
/* Services */

App.factory('$userInfo', ['$http', '$state', '$q',
    function( $http, $state, $q ) {

    var urlConfig = {
        profile         : '/lawyers/profile',
        contacts        : '/lawyers/contacts',
        university      : '/lawyers/universities',
        certificates    : '/lawyers/certificates',
        experiences     : '/lawyers/experience',
        competence      : '/lawyers/competences',
        languages       : '/lawyers/languages'
        },
        baseProfileURL = function(url) {
            return $http({
                        method: 'GET',
                        url: url,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    });
        };

    function getUserProfile() {
        return baseProfileURL(urlConfig.profile).then(function(onFulfilled) {
            return onSuccess(onFulfilled);
        },function(onReject) {
            return onError(onReject);
        });
    };

    function getUserContacts() {
       return baseProfileURL(urlConfig.contacts).then(function(onFulfilled) {
          return onSuccess(onFulfilled);
        },function(onReject) {
            return onError(onReject);
        });
    };

    function getUserUniversity() {
        return baseProfileURL(urlConfig.university).then(function(onFulfilled) {
            return onSuccess(onFulfilled);
        },function(onReject) {
            return onError(onReject);
        });
    };

    function getUserCertificates() {
        return baseProfileURL(urlConfig.certificates).then(function(onFulfilled) {
            return onSuccess(onFulfilled);
        },function(onReject) {
            return onError(onReject);
        });
    };

    function getUserExperience() {
        return baseProfileURL(urlConfig.experiences).then(function(onFulfilled) {
            return onSuccess(onFulfilled);
        },function(onReject) {
            return onError(onReject);
        });
    };

    function getUserCompetences() {
        return baseProfileURL(urlConfig.competence).then(function(onFulfilled) {
            return onSuccess(onFulfilled);
        },function(onReject) {
            return onError(onReject);
        });
    };

    function getUserLanguages() {
        return baseProfileURL(urlConfig.languages).then(function(onFulfilled) {
            return onSuccess(onFulfilled);
        },function(onReject) {
            return onError(onReject);
        });
    };

    function setUserStatus(isLoggedIn) {
        var isLoggedIn = isLoggedIn || false;
        info.isLoggedIn = isLoggedIn;
    };

    function validateData(response) {
        var response = response; // default object to generate default user's form
        // if no data exists for a user
        if (response.data.message) {
            response.data = [{}];
            return response;
        }
        //exception for Experiences, another structure (if not data)
        if (response.data['workPlaces'] && _.isEmpty(response.data['workPlaces'])) {
            response.data = [{}];
            return response;
        }
        // if user has deleted all data
        if (_.isEmpty(response.data)) {
            response.data = [{}];
            return response;
        } else {
            return response;
        }
    }

    function onSuccess(data) {
        try {
            var deferred = $q.defer(),
                _jsonData = validateData( angular.fromJson(data) ),
                copyOfData = angular.copy(_jsonData.data);
            switch (data.config.url) {
                case urlConfig.profile:
                    info['profile'] = _jsonData['data'];
                    deferred.resolve(_jsonData['data']);
                    return deferred.promise;
                case  urlConfig.contacts:
                    info['contacts'] = _jsonData['data'];
                    deferred.resolve(_jsonData['data']);
                    return deferred.promise;
                case urlConfig.university:
                    info['universities'] = _jsonData.data;
                    deferred.resolve(copyOfData);
                    return deferred.promise;
                case urlConfig.certificates:
                    info['certificates'] = _jsonData.data;
                    deferred.resolve(copyOfData);
                    return deferred.promise;
                case urlConfig.experiences:
                    // For experiences the server returns {'workPlaces': [...]} object if data exists
                    info['experiences'] = _jsonData.data;
                    deferred.resolve(copyOfData);
                    return deferred.promise;
                case urlConfig.competence:
                    info['competences'] = _jsonData['data'];
                    deferred.resolve(_jsonData['data']);
                    return deferred.promise;
                case urlConfig.languages:
                    info['languages'] = _jsonData['data'];
                    deferred.resolve(_jsonData['data']);
                    return deferred.promise;
                default:
                    onError(data); //TODO return error object and pass to reject()
                    deferred.reject();
                    return deferred.promise;
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    //TODO: just mock for now. Update error handling
    function onError(data) {
        info.allowed = false;
        var deferred = $q.defer();
        deferred.reject(data);
        return deferred.promise;
    };

    var info = {
        getUserProfile      : getUserProfile,
        getUserContacts     : getUserContacts,
        getUserUniversity   : getUserUniversity,
        getUserCertificates : getUserCertificates,
        getUserExperience   : getUserExperience,
        getUserCompetences  : getUserCompetences,
        getUserLanguages    : getUserLanguages,
        setUserStatus       : setUserStatus,
        profile             : {},
        contacts            : {},
        universities        : {},
        certificates        : {},
        experiences         : {},
        competences         : {},
        languages           : [],
        isLoggedIn          : false
    };
    return info;
}]);
'use strict';
/* Constants */

App.constant('LanguagesList', {
    languages : [
        'English',
        'French',
        'German',
        'Русский',
        'Українська'
     /*   hided for first version
        {"code": "nl", "name": "Dutch", "nativeName": "Nederlands, Vlaams"},
        {"code": "en", "name": "English", "nativeName": "English"},
        {"code": "fr", "name": "French", "nativeName": "français, langue française"},
        {"code": "de", "name": "German", "nativeName": "Deutsch"},
        {"code": "ru", "name": "Russian", "nativeName": "русский язык"},
        {"code": "uk", "name": "Ukrainian", "nativeName": "українська"},
     */
    ]
});
"use strict";
/* Factory */

App.factory('UtilsService', function() {

    /**
     * The function returns array of years from today to 80 year back
     * @param min
     * @param max
     * @returns {Array}
     */
    function generateYears(min, max) {
        var min = min || new Date().getFullYear() - 80,
            max = max || new Date().getFullYear(),
            arrayOfYears = [];

        for (var i = min; i <= max; i++) {
            arrayOfYears.push(i+''); // convert years (int) to string
        };
        return arrayOfYears;
    };

    function convertDate(object, format) {
        var format = format || 'YYYY';

        if ( _.isArray(object) ) {
            angular.forEach(object, function(elem, index) {
                // Server receives only 'DD/MM/YYYY' format
                if ( _.isObject(elem) && _.isEmpty(elem) ) return;
                switch (true) {
                    case elem.hasOwnProperty('startDate'):
                        elem.startDate = moment(elem.startDate).format(format);
                    case elem.hasOwnProperty('endDate'):
                        elem.endDate = moment(elem.endDate).format(format);
                    case elem.hasOwnProperty('date'):
                        elem.date = moment(elem.date).format(format);
                        break;
                    default: break;
                }
            });
        }
        if (object.constructor == Object && object != null && !_.isEmpty(object)) {
            switch (true) {
                case object.hasOwnProperty('startDate'):
                    object.startDate = moment(object.startDate).format(format);
                case object.hasOwnProperty('endDate'):
                    object.endDate = moment(object.endDate).format(format);
                case object.hasOwnProperty('date'):
                    object.date = moment(object.date).format(format);
                    break;
                default:
                    break;
            }
        }

        return object;
    }

    function validateInputPair(_min, _max) {

    };

    return {
        generateYears: generateYears,
        convertDate: convertDate

    }
});

'use strict';
/* Constants */

App.constant('ValidationRules', {
    en: {
        email: {
            identifier: 'email',
            optional: false,
            rules: [
                {
                    type: 'email',
                    prompt: 'Please enter a valid e-mail'
                },
                {
                    type: 'empty',
                    prompt: 'Please enter your email'
                }
            ]
        },
        password: {
            identifier: 'password',
            optional: false,
            rules: [
                {
                    type: 'empty',
                    prompt: 'Please enter your password'
                },
                {
                    type: 'length[6]',
                    prompt: 'Your password must be at least 6 characters'
                }
            ]
        },
        passwordConfirm: {
            identifier: 'cpassword',
            rules: [{
                type: 'match[password]',
                prompt: 'Password don\'t match'
            }]
        },
        firstName: {
            identifier: 'firstName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Your name must be at least 2 characters"
                }
            ]
        },
        lastName: {
            identifier: 'lastName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Your last name must be at least 2 characters"
                }
            ]
        },
        middleName: {
            identifier: 'middleName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Your middle name must be at least 2 characters"
                }
            ]
        },
        street: {
            identifier: 'street',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Your street address must be at least 2 characters"
                }
            ]
        },
        zip: {
            identifier: 'zip',
            optional: true,
            rules: [
                {
                    type: 'length[5]',
                    prompt: "Your zip code must be at least 5 characters"
                },
                {
                    type: 'maxLength[5]',
                    prompt: "Your zip code must be less than 6 characters"
                }
            ]
        },
        facebook: {
            identifier: 'facebook',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Provide a valid URL link to your Facebook account"
                }
            ]
        },
        twitter: {
            identifier: 'twitter',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Provide a valid URL link to your Twitter account"
                }
            ]
        },
        linkedin: {
            identifier: 'linkedin',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Provide a valid URL link to your Linkedin account"
                }
            ]
        },
        website: {
            identifier: 'website',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Provide a valid URL link to your Web page"
                }
            ]
        },
        emailOptional: {
            identifier: 'optEmail',
            optional: true,
            rules:[
                {
                    type: 'email',
                    prompt: 'Provide a valid email address'
                },
                {
                    type: 'empty',
                    prompt: 'Please, enter your email address'
                }
            ]
        }
    },
    uk: {
        email: {
            identifier: 'email',
            optional: false,
            rules: [
                {
                    type: 'email',
                    prompt: 'Будь-ласка введіть коректну електнонну адресу'
                },
                {
                    type: 'empty',
                    prompt: 'Будь-ласка введіть Вашу електронну адресу'
                }
            ]
        },
        password: {
            identifier: 'password',
            optional: false,
            rules: [
                {
                    type: 'empty',
                    prompt: 'Будь-ласка введіть Ваш пароль'
                },
                {
                    type: 'length[6]',
                    prompt: 'Ваш пароль повинен складатись щонайменш з 6 сімволів'
                }
            ]
        },
        passwordConfirm: {
            identifier: 'cpassword',
            rules: [{
                type: 'match[password]',
                prompt: 'Паролі не співпадають'
            }]
        },
        firstName: {
            identifier: 'firstName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Ім'я повино мати щонайменш 2 символи"
                }
            ]
        },
        lastName: {
            identifier: 'lastName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Призвище повино мати щонайменш 2 символи"
                }
            ]
        },
        middleName: {
            identifier: 'middleName',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "По-батькові повино мати щонайменш 2 символи"
                }
            ]
        },
        street: {
            identifier: 'street',
            optional: true,
            rules: [
                {
                    type: 'length[2]',
                    prompt: "Адреса повина мати щонайменш 2 символи"
                }
            ]
        },
        zip: {
            identifier: 'zip',
            optional: true,
            rules: [
                {
                    type: 'length[5]',
                    prompt: "Поштовий індекс повинен мати не менше 5 символів"
                },
                {
                    type: 'maxLength[5]',
                    prompt: "Поштовий індекс повинен бути не більше 5 символів"
                }
            ]
        },
        facebook: {
            identifier: 'facebook',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Введить поссилання на Вашу Facebook сторінку"
                }
            ]
        },
        twitter: {
            identifier: 'twitter',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Введить поссилання на Вашу Twitter сторінку"
                }
            ]
        },
        linkedin: {
            identifier: 'linkedin',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Введить поссилання на Вашу Linkedin сторінку"
                }
            ]
        },
        website: {
            identifier: 'website',
            optional: true,
            rules: [
                {
                    type: 'url',
                    prompt: "Введить поссилання на Вашу Web сторінку"
                }
            ]
        },
        emailOptional: {
            identifier: 'optEmail',
            optional: true,
            rules:[
                {
                    type: 'email',
                    prompt: 'Будь-ласка введіть коректну електнонну адресу'
                },
                {
                    type: 'empty',
                    prompt: 'Будь-ласка введіть Вашу електронну адресу'
                }
            ]
        }

    }
});
'use strict';
/* Controller */

App.controller('CompetenceCtrl', ['$scope', '$http', '$userInfo', '$timeout',
    function ($scope, $http, $userInfo, $timeout) {

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.competences) ) {
            var promiseGetCompetences = $userInfo.getUserCompetences();
            promiseGetCompetences.then(function (onFulfilled) {
                $scope.myCompetences.competences = onFulfilled || [];
            }, function (onReject) {
                $scope.myCompetences.competences = [];
            });
        };
        $scope.myCompetences = {};
        $scope.myCompetences.competences = $userInfo.competences || [];
        $scope.competences = [];
        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        $scope.refreshCompetences = function(search) {
            var params = {competence: search};
            return $http.get(
                '/competences', {params: params}
            ).then(function(response) {
                    $scope.competences = response.data;
                });
        };
        $scope.tagTransform = function (newTag) {
            var item = {
                name: newTag
            };
            return item;
        };
        $scope.setCompetence = function(competence, event) {
            var competence = {competence: competence},
                method = event == 'select' ? 'POST' : 'DELETE',
                url = method == 'DELETE'
                    ? '/lawyers/competences?competence='+ competence.competence
                    : '/lawyers/competences';
            $http({
                method: method,
                url: url,
                data: competence,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function (data, status, headers, config) {

                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        }

    }]);
'use strict';
/* Controller */

App.controller('ContactsCtrl', ['$scope', '$http',
    '$filter', '$userInfo', 'ValidationRules', function ($scope, $http, $filter, $userInfo, ValidationRules) {

        // Default template for phone number and addresses
        var defaultPhoneTemplate = [
            {
                id: '',
                name: '',
                number: ''
            }
        ],
            googleCityTemplate = {
                "selected": {
                    "address_components" : [
                        {
                            "long_name" : "",
                            "short_name" : "",
                            "types" : [ ]
                        }
                    ]
                }
            },
            googleCountryTemplate = {
                "selected": {
                    "address_components" : [
                        {
                            "long_name" : "",
                            "short_name" : "",
                            "types" : [ ]
                        }
                    ]
                }
            };

        // if data saved before do not send request
        if (_.isEmpty($userInfo.contacts)) {
            var promiseGetContacts = $userInfo.getUserContacts();
            promiseGetContacts.then(function (onFulfilled) {
                // if an object contains 'message' key it means that no data exists
                $scope.userContacts = onFulfilled.message ? {} : onFulfilled;
                setAddresses($scope.userContacts);
                $scope.userContacts.phones = onFulfilled.phones ? onFulfilled.phones : defaultPhoneTemplate;
            }, function (onReject) {
                $scope.userContacts = {};
            });
        };
        $scope.userContacts = $userInfo.contacts || {};
        $scope.country = {};
        $scope.city = {};
        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        function setAddresses(data) {
            switch (true) {
                case _.isEmpty(data):
                    break;
                case !!data.city:
                    googleCityTemplate.selected.address_components[0].long_name = data.city;
                    $scope.city = googleCityTemplate;
                case !!data.country:
                    googleCountryTemplate.selected.address_components[0].long_name = data.country;
                    $scope.country = googleCountryTemplate;
                    break;
            };

        };
        $scope.refreshCountry = function(address) {
            var params = {address: address, sensor: false, language: 'en'}; //TODO: Update locale on the localization phase
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function(response) {
                    $scope.countries = response.data.results;
                });
        };
        $scope.refreshCity = function(address) {
            var params = {address: address, sensor: false, language: 'en'}; //TODO: Update locale on the localization phase
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function(response) {
                    $scope.cities = response.data.results;
                });
        };
        $scope.userContacts.phones = $userInfo.contacts.phones || defaultPhoneTemplate;
        $scope.addPhone = function (phoneNumber) {
            var template = { id: '', name: '', number: '' },
                isUnique = isNumberUnique(phoneNumber);
            if (isUnique) {
                $scope.userContacts.phones.push(template);
            };
        };

        function isNumberUnique(value) {
            if (value == '') return;
            var array = $scope.userContacts.phones,
                uniqArray = _.uniq(array, 'number');

            return array.length == uniqArray.length;
        };
        $scope.updateContacts = function () {
            var contacts = angular.copy($scope.userContacts);
            contacts.city = $scope.city.selected
                ? $scope.city.selected.address_components[0].long_name : undefined;
            contacts.country = $scope.country.selected
                ? $scope.country.selected.address_components[0].long_name : undefined;

            $http({
                method: 'PUT',
                url: '/lawyers/contacts',
                data: contacts,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function (data, status, headers, config) {
                    $scope.formStatus.isEditModeOpen = true;
                    $scope.isUpdated = true;
                    $scope.error = false;
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        };

        // *** JQUERY SECTION ***

        // Profile form validation
        (function ($) {
            $('.ui.form')
                .form(ValidationRules.en);
        })(jQuery);

    }]);
'use strict';
/* Controller */

App.controller('ExperienceCtrl', ['$scope', '$http', '$userInfo', 'UtilsService',
    function ($scope, $http, $userInfo, UtilsService) {

        // if data had been saved before, do not send a request
        if ( _.isEmpty($userInfo.experiences) ) {
            var promiseGetExperience = $userInfo.getUserExperience();
            promiseGetExperience.then(function (onFulfilled) {
                // assign [{}] object if request returns an empty object.
                // [{}] - is used to build default html template
                // extra validation is needed due to another structure of data for the Experiences
                $scope.experiences = ( onFulfilled['workPlaces'] && !_.isEmpty(onFulfilled['workPlaces']) )
                    ? UtilsService.convertDate(onFulfilled['workPlaces'])
                    : [{}];
            }, function (onReject) {
                $scope.experiences = [{}];
            });
        };

        this.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        $scope.experience = {};
        $scope.experiences = $userInfo.experiences || [{}];
        $scope.selectorYears = UtilsService.generateYears();
        var formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
            format = formats[0],
            experiencesCounter = 0;
        $scope.addExperience = function () {
            var experiencesTemplate = {
                id: experiencesCounter
            };
            experiencesCounter += 1;
            $scope.experiences.push(experiencesTemplate);
        };
        $scope.removeExperience = function(obj) {
            angular.forEach($scope.experiences, function(elem, index) {
                // if user added a form that not saved on the server yet, just delete UI
                if ($scope.experiences.length != $scope.experiences.length &&
                    $scope.experiences[index]['id'] == obj['id']) {
                    $scope.experiences.splice(index, 1);
                    return;
                }
                if ( $scope.experiences[index]['id'] == obj['id'] ) {
                    $http({
                        method: 'DELETE',
                        url: '/lawyers/experience/' + obj['id'],
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    }).
                        success(function (data, status, headers, config) {
                            $scope.experiences.splice(index, 1);
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = 'Unexpected error. Please try again later.';
                        });
                }
            })
        };
        $scope.updateExperience = function (object) {
            var copyObject = angular.copy(object);
            copyObject = UtilsService.convertDate(copyObject, formats[1] ); // helps to avoid overwriting of UI
            // The server generates hash ID for saved forms,
            // if new form is added from UI and the ID starts from 0 (means that id is not saved on the server )
            var method = isFinite(object.id) || !object.id ? 'POST' : 'PUT',
                url = method == 'POST' ? '/lawyers/experience' : '/lawyers/experience/' + object.id;
            $http({
                method: method,
                url: url,
                data: copyObject,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function (data, status, headers, config) {
                    $scope.isUpdated = true;
                    $scope.error = false;
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                    $scope.isUpdated = false;
                });

        };
}]);
'use strict';
/* Controller */

App.controller('CertificatesCtrl', ['$scope', '$http', '$userInfo', 'UtilsService',
    function($scope, $http, $userInfo, UtilsService) {

        var formats = ['MM', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
            format = formats[0],
            certificateCounter = 0;

        this.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.certificates) ) {
            var promiseGetCertificates = $userInfo.getUserCertificates();
            promiseGetCertificates.then(function (onFulfilled) {
                $scope.certificates = UtilsService.convertDate(onFulfilled) || [{}];
            }, function (onReject) {
                $scope.certificates = [{}];
            });
        };
        $scope.certificate = {};
        $scope.certificates = $userInfo.certificates || [{}];
        $scope.addCertificate = function () {
            var certificateTemplate = {
                id: certificateCounter
            };
            certificateCounter += 1;
            $scope.certificates.push(certificateTemplate);
        };
        $scope.selectorYears = UtilsService.generateYears();
        $scope.removeCertificate = function(obj) {
            angular.forEach($scope.certificates, function(elem, index) {
                // if user added a form that not saved on the server yet, just delete UI
                if ($userInfo.certificates.length != $scope.certificates.length &&
                    $scope.certificates[index]['id'] == obj['id']) {
                    $scope.certificates.splice(index, 1);
                    return;
                }
                if ( $scope.certificates[index]['id'] == obj['id'] ) {
                    $http({
                        method: 'DELETE',
                        url: '/lawyers/certificates/' + obj['id'],
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    }).
                        success(function (data, status, headers, config) {
                            $scope.certificates.splice(index, 1);
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = 'Unexpected error. Please try again later.';
                        });
                }
            })
        };

        $scope.updateCertificates = function (object) {
            var copyObject = angular.copy(object);
            copyObject = UtilsService.convertDate(copyObject, formats[1] ); // helps to avoid overwriting of UI
            // The server generates hash ID for saved forms,
            // if new form is added from UI and the ID starts from 0 (means that id is not saved on the server )
            var method = isFinite(object.id) || !object.id ? 'POST' : 'PUT',
                url = method == 'POST' ? '/lawyers/certificates' : '/lawyers/certificates/' + object.id;

                $http({
                    method: method,
                    url: url,
                    data: copyObject,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).
                    success(function (data, status, headers, config) {
                        $scope.isUpdated = true;
                        $scope.error = false;
                    }).
                    error(function (data, status, headers, config) {
                        $scope.error = 'Unexpected error. Please try again later.';
                        $scope.isUpdated = false;
                    });
        };

}]);
'use strict';
/* Controller */

App.controller('LanguagesCtrl', ['$scope', '$http', '$userInfo', 'LanguagesList',
    function ($scope, $http, $userInfo, LanguagesList) {

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.languages) ) {
            var promiseGetLanguages = $userInfo.getUserLanguages();
            promiseGetLanguages.then(function (onFulfilled) {
                $scope.languages = onFulfilled || [];
            }, function (onReject) {
                $scope.languages = [];
            });
        };
        $scope.language = {};
        $scope.languages = $userInfo.languages || [];
        $scope.listOfLanguages = LanguagesList.languages;
        $scope.languagesModel = {};
        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        $scope.tagTransform = function (newTag) {
            var item = {
                name: newTag
            };

            return item;
        };
        $scope.setLanguages = function(language, event) {
            var language = {language: language},
                method = event == 'select' ? 'POST' : 'DELETE';
            $http({
                method:  method,
                url: '/lawyers/languages?language=' + language.language,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function (data, status, headers, config) {

                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        }



    }]);
'use strict';
/* Controller */

App.controller('UniversitiesCtrl', ['$scope', '$http', '$userInfo', 'UtilsService',
    function ($scope, $http, $userInfo, UtilsService) {

        var formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
            format = formats[0],
            universityCounter = 0;

        this.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.universities) ) {
            var promiseGetUniversity = $userInfo.getUserUniversity();
            promiseGetUniversity.then(function (onFulfilled) {
                $scope.universities = UtilsService.convertDate(onFulfilled) || [{}];
            }, function (onReject) {
                $scope.universities = [{}];
            });
        };
        $scope.university = {};
        $scope.universities = $userInfo.universities || [{}];
        $scope.degrees = [
          "master"
        ];
        $scope.selectorYears = UtilsService.generateYears();

        $scope.addUniversity = function () {
            var universityTemplate = {
                id: universityCounter
            };
            universityCounter += 1;
            $scope.universities.push(universityTemplate);
        };
        $scope.removeUniversity = function(obj) {
            angular.forEach($scope.universities, function(elem, index) {
                // if user added a form that not saved on the server yet, just delete UI
                if ($userInfo.universities.length != $scope.universities.length &&
                    $scope.universities[index]['id'] == obj['id']) {
                    $scope.universities.splice(index, 1);
                    return;
                }
                if ( $scope.universities[index]['id'] == obj['id'] ) {
                    $http({
                        method: 'DELETE',
                        url: '/lawyers/universities/' + obj['id'],
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    }).
                        success(function (data, status, headers, config) {
                            $scope.universities.splice(index, 1);
                        }).
                        error(function (data, status, headers, config) {
                            $scope.error = 'Unexpected error. Please try again later.';
                        });
                }
            })
        };

        $scope.updateEducation = function (object) {
            var copyObject = angular.copy(object);
            copyObject = UtilsService.convertDate(copyObject, formats[1] ); // helps to avoid overwriting of UI
                // The server generates hash ID for saved forms,
                // if new form is added from UI and the ID starts from 0 (means that id is not saved on the server )
                var method = isFinite(object.id) || !object.id ? 'POST' : 'PUT',
                    url = method == 'POST' ? '/lawyers/universities' : '/lawyers/universities/' + object.id;
                $http({
                    method: method,
                    url: url,
                    data: copyObject,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).
                    success(function (data, status, headers, config) {
                        $scope.isUpdated = true;
                        $scope.error = false;
                    }).
                    error(function (data, status, headers, config) {
                        $scope.error = 'Unexpected error. Please try again later.';
                        $scope.isUpdated = false;
                    });

        };
    }]);
'use strict';
/* Controller */


App.controller('FiltersCtrl', ['$scope', '$http', '$userInfo', 'LanguagesList', '$filterService',
    '$timeout',
    function ($scope, $http, $userInfo, LanguagesList, $filterService, $timeout) {

        $scope.formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.filters = {};
        $scope.tableState = {
            isFound: false,
            isEmpty: false
        };
        $scope.competences = [];
        $scope.genderTypes = [ //TODO: get from the server
            { name: 'Male', id: 'm' },
            { name: 'Female', id: 'f' }
        ];
        $scope.languages = LanguagesList.languages;

        $scope.refreshAddresses = function(address) {
            var params = {address: address, sensor: false, language: 'uk'}; //TODO: Update locale on the localization phase
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function(response) {
                    $scope.addresses = response.data.results;
                });
        };
        $scope.refreshCompetences = function(search) {
            var params = {competence: search};
            return $http.get(
                '/competences', {params: params}
            ).then(function(response) {
                    $scope.competences = response.data;
                });
        };

        $scope.additionalFl = {};
        $scope.validateInputPair = function(_min, _max) {
            var min = $scope.additionalFl[_min],
                max = $scope.additionalFl[_max];

            function setInvalid() {
                $scope[_min].invalid = true;
            }

            $scope[_min] = {};
            if ((!!min && !max && max !== 0) || (!!max && !min && min !== 0)) {
                $scope[_min].requiredBothError = true;
                setInvalid()
            }
            if (!_.isNaN(+min) && !_.isNaN(+max)) {
                if (+max < +min) {
                    $scope[_min].pairError = true;
                    setInvalid();
                }
            } else {
                setInvalid();
            }
        };
        $scope.resetFilter = function() {
            // Reset filters to default values
            $scope.filters = {};
        };

        function convertTime(data) {
            var data = data;
            if (_.isEmpty(data)) {
                return data;
            }
            angular.forEach(data, function(elem, index) {
                if (_.isNull(data[index]['profile']['birthDate'])) return;
                data[index]['profile']['birthDate'] = moment(new Date(data[index]['profile']['birthDate'])).format($scope.formats[1]);
            });
            return data;
        };

        function checkAvatar(data) {
            angular.forEach(data, function(elem, index) {
                if (_.isNull(data[index]['avatar'])) {
                    // TODO add constant to CONSTANT object
                    data[index]['avatar'] = 'assets/build/images/mock_64.svg';
                }
            });
            return data;
        };
        $scope.getSelectedLawyer = function(lawyerID) {
            $filterService.saveSelectedLawyer(lawyerID);
        };
        $scope.getResults = function() {
            // rewrite form obj to needed format
            var params = angular.copy($scope.filters);
            delete params.address; // delete google obj
            params.city = $scope.filters.address
                ? $scope.filters.address.selected.address_components[0].long_name
                : undefined;
            params.gender = $scope.filters.gender
                ? $scope.filters.gender.id
                : undefined;
            $http.post('/lawyers/filter', params)
                .success(function (data, status, headers, config) {
                    if ( _.isEmpty(data) ) {
                        $scope.tableState.isFound = false;
                        $scope.tableState.isEmpty = true;
                        return;
                    }
                    $scope.tableState.isFound = true;
                    $scope.tableState.isEmpty = false;
                    $scope.searchResponse = convertTime(data);
                    $scope.searchResponse = checkAvatar(data);
                    // Save filter results to Service
                    $filterService.saveFoundLawyers(data);
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        };

        // *** JQUERY ****

        $('.ui.checkbox')
            .checkbox({
                'onChange': function() {
                    $scope.filters.availability = ! $scope.filters.availability
                }
            });

        // ***************

        $scope.show = false;
        $timeout(function() {
            $scope.show  = true;
        }, 1000);
        $scope.id = "bob";
        $scope.id2 = "bob";
        $scope.value = "10;50";
        $scope.value2 = "12;15";
        $scope.value3 = "10;12";
        $scope.value4 = "999;1700";
        $scope.value5 = "10;20";
        $scope.value6 = "10;53";
        $scope.valueVisibility = "40;70";
        $scope.disa = true;
        $scope.disabledtoto = false;
        $scope.data = {
            quote: {
                coverages: {
                    coverageA: 200000
                }
            }
        };
        $scope.defaultAmount=190000;
        $scope.coverageASliderOptions = {
            from: $scope.defaultAmount,
            to: $scope.defaultAmount+ ($scope.defaultAmount* 0.20),
            step: 500,
            calculate: function(value) {
                return $filter('currency')(value, '$', 0);
            }
        };
        $scope.disable = function() {
            $scope.disabledtoto = !$scope.disabledtoto;
        };
        $scope.toggleVisibility = function () {
            $scope.show = !$scope.show;
        };
        var calculate = function( value ) {
            var hours = Math.floor( value / 60 );
            var mins = ( value - hours*60 );
            return (hours < 10 ? "0"+hours : hours) + ":" + ( mins == 0 ? "00" : mins );
        };
        $scope.options = {
            to: 40,
            from: 0,
            step: 1,
            dimension: " km",
            vertical: false,
            scale: [0, '|', 10, '|', 20, '|' , 30, '|', 40],
            // round: 2,
            skin: 'round',
            modelLabels: {1: 'test1', 2: 'test3'},
            realtime: true,
            /*css: {
             background: {'background-color': 'yellow'},
             before: {'background-color': 'purple'},
             default: {'background-color': 'white'},
             after: {'background-color': 'green'},
             pointer: {'background-color': 'red'}
             },*/
            limits: false,
            callback: function(value, released) {
                console.log(value + " " + released);
            }
        };
        $scope.optionsVisibility = {
            from: 10,
            to: 100,
            step: 1,
            dimension: ' min',
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.optionsCss = {
            from: 1,
            to: 100,
            step: 1,
            dimension: " km",
            vertical: false,
            css: {
                background: {'background-color': 'yellow'},
                before: {'background-color': 'purple'},
                default: {'background-color': 'white'},
                after: {'background-color': 'green'},
                pointer: {'background-color': 'red'}
            },
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.optionsV = {
            from: 0,
            to: 40,
            step: 0.5,
            dimension: " $",
            round: 1,
            skin: 'jslider_blue',
            scale: [0, '|', 10, '|', 20, '|' , 30, '|', 40],
            vertical: true,
            /*css: {
             background: {"background-color": "yellow"},
             before: {"background-color": "purple"},
             default: {"background-color": "blue"},
             after: {"background-color": "green"},
             pointer: {"background-color": "red"}
             },*/
            callback: function(value, elt) {
                console.log(value);
                console.log(elt);
            }
            // calculate: calculate
        };
        $scope.options2 = {
            from: 0,
            to: 100,
            floor: true,
            step: 10,
            dimension: " km",
            css: {
                background: {"background-color": "yellow"},
                before: {"background-color": "purple"},
                default: {"background-color": "white"},
                after: {"background-color": "green"},
                pointer: {"background-color": "red"}
            },
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.options2V = {
            from: 1,
            to: 100,
            floor: true,
            step: 10,
            dimension: " km",
            vertical: true,
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.options2VCSS = {
            from: 1,
            to: 100,
            floor: true,
            step: 10,
            dimension: " km",
            vertical: true,
            css: {
                background: {"background-color": "yellow"},
                before: {"background-color": "purple"},
                default: {"background-color": "blue"},
                after: {"background-color": "green"},
                pointer: {"background-color": "red"}
            },
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.options3 = {
            from: 700,
            to: 2100,
            step: 1,
            smooth: false,
            dimension: " mb",
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.changeOptions = function() {
            $scope.options = {
                from: 0,
                to: 80,
                step: 1,
                dimension: " $",
                scale: [0, '|', 10, '|', 20, '|' , 30, '|', 40, '|', 50, '|', 60, '|', 70, '|', 80]
            };
        };
        $scope.changeValue = function() {
            $scope.value = "11;15";
            $scope.value2 = "13;15";
            $scope.value3 = 20;
            $scope.value4 = "700;1000";
        };


        //****************



    }]);

'use strict';
/* Controller */

// The controller injected directly into html, avoiding routers
App.controller('HeaderCtrl', ['$scope', '$rootScope', '$http', '$userInfo',
    function ($scope, $rootScope, $http, $userInfo) {

        $rootScope.currentUser = $rootScope.currentUser
            || $userInfo.isLoggedIn
            || sessionStorage.getItem('token');

    }]);
'use strict';
/* Controller */

// The controller injected directly into html, avoiding routers
App.controller('HomeCtrl', ['$scope', '$http',
    function ($scope, $http) {

    }]);
'use strict';

App.controller('LoginCtrl', ['$scope', '$state', '$http', '$userInfo', 'AuthService', '$rootScope', 'ValidationRules',
    function($scope, $state, $http, $userInfo, AuthService, $rootScope, ValidationRules) {

        $scope.signIn = {};
        $scope.error = false;
        $scope.submit = function(signIn) {
            AuthService.login(signIn)
                .success(function(data, status, headers, config) {
                    $rootScope.currentUser = data['token'];
                    AuthService.setCurrentUser(data['token']);
                    $state.go('myAccount');
            })
                .error(function(data, status, headers, config) {
                    $scope.error = data.message;
            });
        };

        // *** JQUERY SECTION ***

        // Login form validation
        (function ($) {
            $('.ui.form')
                .form(ValidationRules.en);
        })(jQuery);


}]);
'use strict';
/* Controller */

App.controller('LoginModalCtrl', ['$scope', '$http',
    function ($scope, $http) {

    this.cancel = $scope.$dismiss;

    $scope.submit = function (email, password) {
        var data = {
            'email': email,
            'password': password
        };
        $http({
            method: 'POST',
            url: '/auth/login',
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).then(function (user) {
            $scope.$close(user);
        });

    };

}]);
'use strict';
/* Controller - part of My Account (manage legal services), visible for lawyer, not a user */

App.controller('MarketPlaceLawyerCtrl', ['$scope', '$http', 'MarketPlaceService',
  function ($scope, $http, MarketPlaceService) {

    var taskCounter = 0;
    $scope.tasksInLegalIssue = [];
    $scope.allLegalIssues = [];
    $scope.taskTitle = {};

    $scope.addNewTask = function() {
      var task = angular.copy($scope.taskTitle);
      // assign ID to added task
      task.id = taskCounter;
      $scope.tasksInLegalIssue.push(task);
      taskCounter += 1;
      // clear input after adding the task
      $scope.taskTitle.title = '';
    };

    $scope.getElement = function(obj, index) {
      // Save information about selected object for ng-class
      // and for Detail section
      $scope.taskDetail = obj;
      $scope.taskDetail.index = index;
    };

    $scope.removeTask = function(obj) {
      angular.forEach($scope.tasksInLegalIssue, function(elem, index) {
        // if user added a form that not saved on the server yet, just delete UI
        if ($scope.tasksInLegalIssue.length != $scope.tasksInLegalIssue.length &&
            $scope.tasksInLegalIssue[index]['id'] == obj['id']) {
          $scope.tasksInLegalIssue.splice(index, 1);
          return;
        }
        if ( $scope.tasksInLegalIssue[index]['id'] == obj['id'] ) {
          $http({
            method: 'DELETE',
            url: '/api/..' + obj['id'],
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          }).
              success(function (data, status, headers, config) {
                $scope.tasksInLegalIssue.splice(index, 1);
              }).
              error(function (data, status, headers, config) {
                $scope.error = 'Unexpected error. Please try again later.';
              });
        }
      })

    };

  }]);
'use strict';
/* Service */

// The factory returns promise for MarketPlace
App.factory('MarketPlaceService', function($http) {
        return {
            get : function() {
                return $http.get('/api/...');
            },
            create : function(marketTask) {
                return $http.post('/api/...', marketTask);
            },
            delete : function(id) {
                return $http.delete('/api/.../' + id);
            }
        }
    });
'use strict';
/* Controller */

App.controller('MarketPlace', [ '$scope', '$http',
    function( $scope, $http ) {


    }]);

'use strict';
/* Controller */

App.controller('LandingPageCtrl', ['$scope', '$http', '$userInfo', '$rootScope', '$state',
    function ($scope, $http, $userInfo, $rootScope, $state) {


    }]);
'use strict';
/* Controller */

App.controller('ProfileCtrl', ['$scope', '$http',
    '$filter', '$userInfo', 'ValidationRules', 'UtilsService',
    function($scope, $http, $filter, $userInfo, ValidationRules, UtilsService) {
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
        $scope.selectorYears = UtilsService.generateYears();

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
            var _userProfile = angular.copy(userProfile);
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
                .form(ValidationRules.en);
        })(jQuery);

}]);

'use strict';
/* Controller */

App.controller('PublicProfileCtrl', ['$scope', '$http', '$filterService', '$location',
    function ($scope, $http, $filterService, $location) {

        var userProfileObj = $filterService.getSelectedLawyerObj();
        // if data had saved before, do not send a request
        if ( _.isEmpty(userProfileObj) ) {
            var promiseGetPublicProfile = getPublicProfile();
            promiseGetPublicProfile.then(function (onFulfilled) {

            }, function (onReject) {

            });
        };

        function getPublicProfile() {
            // get a profile ID from the URL, starting from 'public/' url
            // if user uses a direct url to load the profile
            var profileUrlId = $location.url().slice(8);
            return $http({
                        method: 'GET',
                        url: '/lawyers/public/' + profileUrlId,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                   });
        };


        $scope.profile = userProfileObj.profile;
        $scope.competences = userProfileObj.competences;
        $scope.education = userProfileObj.education;
        $scope.experiences = userProfileObj.experience.total == 0
            ? []
            : userProfileObj.experience.workPlaces;


    }]);
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