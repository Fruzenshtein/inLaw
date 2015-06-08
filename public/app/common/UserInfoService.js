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