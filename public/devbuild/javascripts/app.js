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

    //TODO: add a parser to check if a user has updated some form before or no
    //TODO: (by 'id') and send appropriate request PUT or POST
    function isFormModified(onFulfilled) {

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

    function isAuthenticated(data) {
      if (!sessionStorage.getItem('token')) return;

      if (data['status'] == 401) {
            $state.go('login');
            return false;
        } else if (data['status'] == 200) {
            return true;
        } else {
            return false;
        }
    };

    function setUserStatus(isLoggedIn) {
        var isLoggedIn = isLoggedIn || false;
        info.isLoggedIn = isLoggedIn;
    };

    function onSuccess(data) {
        try {
            var deferred = $q.defer(),
                container,
                _jsonData = angular.fromJson(data);
            if ( !isAuthenticated(_jsonData) ) return;
            info.allowed = true;
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
                    info['universities'] = _jsonData['data'];
                    deferred.resolve(_jsonData['data']);
                    return deferred.promise;
                case urlConfig.certificates:
                    info['certificates'] = _jsonData['data'];
                    deferred.resolve(_jsonData['data']);
                    return deferred.promise;
                case urlConfig.experiences:
                    // For experiences the server returns {'workPlaces': [...]} object if data exists
                    info['experiences'] = _jsonData['data']['workPlaces'] ?
                        _jsonData['data']['workPlaces'] : {} ;
                    deferred.resolve(info['experiences']);
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

    function onError(data) {
        isAuthenticated(data);
        info.allowed = false;
    };

    var info = {
        authenticate        : isAuthenticated,
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
        'Dutch',
        'English',
        'French',
        'German',
        'Russian',
        'Ukrainian'
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
    '$filter', '$userInfo', function ($scope, $http, $filter, $userInfo) {

        // Default template for phone number
        var defaultPhoneTemplate = [{
            id: 'phone',
            name: 'Work',
            number: ''
        }];
        // if data saved before do not send request
        if (_.isEmpty($userInfo.contacts)) {
            var promiseGetContacts = $userInfo.getUserContacts();
            promiseGetContacts.then(function (onFulfilled) {
                $scope.userContacts = onFulfilled || {};
                $scope.userContacts.phones = onFulfilled ? onFulfilled : defaultPhoneTemplate;
            }, function (onReject) {
                $scope.userContacts = {};
            });
        };
        $scope.userContacts = $userInfo.contacts || {};
        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        $scope.phoneCounter = 0;
        $scope.userContacts.phones = $userInfo.contacts.phones || defaultPhoneTemplate;
        $scope.addPhone = function () {
            $scope.phoneTemplate = {
                id: 'phone' + $scope.phoneCounter,
                name: '',
                number: ''
            };
            $scope.phoneCounter += 1;
            $scope.userContacts.phones.push($scope.phoneTemplate);
        };
        $scope.removePhone = function () {
            $scope.phoneCounter -= 1;
            $scope.phones.length -= 1;
        };

        $scope.isNumberUnique = function(value) {
            if (value == '') return;
            angular.forEach($scope.userContacts.phones, function(elem, index) {
                if (elem['number'] == value)
                    console.log(elem['number']);
                    return true;
            })
        };
        $scope.updateContacts = function (contacts) {
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
        }
    }]);
'use strict';
/* Controller */

App.controller('CertificatesCtrl', ['$scope', '$http', '$userInfo', function($scope, $http, $userInfo) {

    // if data had saved before, do not send a request
    if ( _.isEmpty($userInfo.certificates) ) {
        var promiseGetCertificates = $userInfo.getUserCertificates();
        promiseGetCertificates.then(function (onFulfilled) {
            $scope.certificates = onFulfilled || [{}];
        }, function (onReject) {
            $scope.certificates = [{}];
        });
    };
    $scope.certificate = {};
    $scope.certificates = $userInfo.certificates || [{}];
    $scope.certificateCounter = 0;
    $scope.addCertificate = function () {
        $scope.certificateTemplate = {
            id: $scope.certificateCounter
        };
        $scope.certificateCounter += 1;
        $scope.certificates.push($scope.certificateTemplate);
    };
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

    $scope.updateCertificates = function (array) {
        angular.forEach(array, function(elem, index) {
            array[index].date = moment(array[index].date).format($scope.formats[1]);
            $http({
                method: 'POST',
                url: '/lawyers/certificates',
                data: array[index],
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function (data, status, headers, config) {
                    $scope.formStatus.isEditModeOpen = true;
                    $scope.isUpdated = true;
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        });
    };

    $scope.formStatus = {
        isEditModeOpen: true,
        isEditModeDisabled: false
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        var years100ago = new Date();
        // Time 100 years ago
        years100ago.setTime(years100ago.valueOf() - 100 * 365 * 24 * 60 * 60 * 1000);
        $scope.minDate = $scope.minDate ? null : new Date(years100ago);
    };
    $scope.toggleMin();
    $scope.maxDate = new Date();
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        minMode: 'month'
    };

    $scope.formats = ['MM', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

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

App.controller('UniversitiesCtrl', ['$scope', '$http', '$userInfo',
    function ($scope, $http, $userInfo) {

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.universities) ) {
            var promiseGetUniversity = $userInfo.getUserUniversity();
            promiseGetUniversity.then(function (onFulfilled) {
                $scope.universities = onFulfilled || [{}];
            }, function (onReject) {
                $scope.universities = [{}];
            });
        };
        $scope.university = {};
        $scope.universities = $userInfo.universities || [{}];
        $scope.universityCounter = 0;
        $scope.addUniversity = function () {
            $scope.universityTemplate = {
                id: $scope.universityCounter
            };
            $scope.universityCounter += 1;
            $scope.universities.push($scope.universityTemplate);
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

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            var years100ago = new Date();
            // Time 100 years ago
            years100ago.setTime(years100ago.valueOf() - 100 * 365 * 24 * 60 * 60 * 1000);
            $scope.minDate = $scope.minDate ? null : new Date(years100ago);
        };
        $scope.toggleMin();
        $scope.maxDate = new Date();
        $scope.openStart = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.openedEnd = false;
            this.openedStart = true;
        };
        $scope.openEnd = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.openedStart = false;
            this.openedEnd = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            minMode: 'year'
        };

        $scope.formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        $scope.updateEducation = function (array) {
            angular.forEach(array, function(elem, index) {
                array[index].startDate = moment(array[index].startDate).format($scope.formats[1]);
                array[index].endDate = moment(array[index].endDate).format($scope.formats[1]);
                // Send one object per time. TBD... improvement is added to API side with ability to send an array
                $http({
                    method: 'POST',
                    url: '/lawyers/universities',
                    data: array[index],
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).
                    success(function (data, status, headers, config) {
                        $scope.formStatus.isEditModeOpen = true;
                        $scope.isUpdated = true;
                    }).
                    error(function (data, status, headers, config) {
                        $scope.error = 'Unexpected error. Please try again later.';
                    });
            });
        };
    }]);
'use strict';
/* Controller */

App.controller('ExperienceCtrl', ['$scope', '$http', '$userInfo',
    function ($scope, $http, $userInfo) {

        // if data had been saved before, do not send a request
        if ( _.isEmpty($userInfo.experiences) ) {
            var promiseGetExperience = $userInfo.getUserExperience();
            promiseGetExperience.then(function (onFulfilled) {
                // assign [{}] object if request returns an empty object.
                // [{}] - is used to build default html template
                $scope.experiences = _.isEmpty(onFulfilled) ? [{}] : onFulfilled;
            }, function (onReject) {
                $scope.experiences = [{}];
            });
        };

        $scope.experience = {};
        $scope.experiences = $userInfo.experiences || [{}];
        $scope.experiencesCounter = 0;
        $scope.addExperience = function () {
            $scope.experiencesTemplate = {
                id: $scope.experiencesCounter
            };
            $scope.experiencesCounter += 1;
            $scope.experiences.push($scope.experiencesTemplate);
        };
        $scope.removeExperience = function(obj) {
            angular.forEach($scope.experiences, function(elem, index) {
                if ( $scope.experiences[index]['id'] == obj['id'] ) {
                    $scope.experiences.splice(index, 1);
                }
                // TODO: API call
            })
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            var years100ago = new Date();
            // Time 100 years ago
            years100ago.setTime(years100ago.valueOf() - 100 * 365 * 24 * 60 * 60 * 1000);
            $scope.minDate = $scope.minDate ? null : new Date(years100ago);
        };
        $scope.toggleMin();
        $scope.maxDate = new Date();

        $scope.openStart = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.openedEnd = false;
            this.openedStart = true;
        };
        $scope.openEnd = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.openedStart = false;
            this.openedEnd = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            minMode: 'month'
        };

        $scope.formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };

        $scope.updateExperience = function (array) {
            angular.forEach(array, function(elem, index) {
                array[index].startDate = moment(array[index].startDate).format($scope.formats[1]);
                array[index].endDate = moment(array[index].endDate).format($scope.formats[1]);
                $http({
                    method: 'POST',
                    url: '/lawyers/experience',
                    data: array[index],
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                }).
                    success(function (data, status, headers, config) {
                        $scope.formStatus.isEditModeOpen = true;
                        $scope.isUpdated = true;
                        $scope.error = '';
                    }).
                    error(function (data, status, headers, config) {
                        $scope.error = 'Unexpected error. Please try again later.';
                    });
            });
        };
}]);
'use strict';
/* Controller */


App.controller('FiltersCtrl', ['$scope', '$http', '$userInfo', 'LanguagesList', '$filterService',
    function ($scope, $http, $userInfo, LanguagesList, $filterService) {

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
                    data[index]['avatar'] = 'assets/devbuild/images/mock_64.svg';
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
                        $scope.tableState.isEmpty = true
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

    }]);

'use strict';
/* Controller */

App.controller('LandingPageCtrl', ['$scope', '$http', '$userInfo', '$timeout',
    function ($scope, $http, $userInfo) {

    $scope.isLoggedIn = $userInfo.isLoggedIn;


    }]);
'use strict';

App.controller('LoginCtrl', ['$scope', '$state', '$http', '$userInfo',
    function($scope, $state, $http, $userInfo) {

    $scope.signIn = {};
    $scope.error = false;

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
                sessionStorage.setItem('token', data['token']);
                $userInfo.setUserStatus(true);
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
/* Controller */

App.controller('ProfileCtrl', ['$scope', '$http',
    '$filter', '$userInfo', function($scope, $http, $filter, $userInfo) {
    // if data saved before do not send request
    if ( _.isEmpty($userInfo.profile) ) {
        var promiseGetProfile = $userInfo.getUserProfile();
        promiseGetProfile.then(function (onFulfilled) {
            $scope.userProfile = onFulfilled || {};
        }, function (onReject) {
            $scope.userProfile = {};
        });
    };
    $scope.error = false;
    $scope.isUpdated = false;

    $scope.formStatus = {
        isEditModeOpen: true,
        isEditModeDisabled: false
    };

    $scope.today = function() {
        $scope.userProfile =  $userInfo.profile || {}; // fists initialization starts here, from function
        $scope.userProfile.birthDate = $filter('date')($userInfo.profile.birthDate, $scope.format) || +new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.userProfile.birthDate = null;
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
            "birthDate": $filter('date')(userProfile.birthDate, $scope.format),
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
            // get profile ID from the URL, starting from 'public/' url
            var profileUrlId = $location.url().slice(8);
            return $http({
                        method: 'GET',
                        url: '/lawyers/public/' + profileUrlId,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                   });
        };


    }]);
'use strict';

App.controller('RegistrationCtrl',['$scope', '$state', '$http', '$userInfo',
    function($scope, $state, $http, $userInfo) {

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
                sessionStorage.setItem('token', data.token);
                $userInfo.setUserStatus(true);
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