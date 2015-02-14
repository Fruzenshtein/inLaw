'use strict';
/* Services */

App.factory('$userInfo', ['Restangular', '$http', '$state', '$q', function( Restangular, $http, $state, $q ) {
/*
// TODO will experiment with Restangular
    var baseProfileURL = Restangular.withConfig(function(Configurer){
        Configurer.setBaseUrl('lawyers');
        Configurer.setDefaultHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        });
    });
*/
    // Relative URLs object
    var urlConfig = {
        profile         : '/lawyers/profile',
        contacts        : '/lawyers/contacts',
        university      : '/lawyers/education/universities',
        certificates    : '/lawyers/education/certificates'
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

    function isAuthenticated(data) {

        if( _.isEmpty(data['data']) ) {
            //TODO
            return false;
        } else if (data['status'] == 401) {
            $state.go('login');
            return false;
        } else if (data['status'] == 200) {
            return true;
        } else {
            return false;
        }
    };

    function onSuccess(data) {
        try {
            var deferred = $q.defer();
            var _jsonData = angular.fromJson(data);
            if ( !isAuthenticated(_jsonData) ) return;

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

    };

    var info = {
        authenticate        : isAuthenticated,
        getUserProfile      : getUserProfile,
        getUserContacts     : getUserContacts,
        getUserUniversity   : getUserUniversity,
        getUserCertificates : getUserCertificates,
        profile             : {},
        contacts            : {},
        universities        : {},
        certificates        : {},
        allowed             : false
    };
    return info;
}]);