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