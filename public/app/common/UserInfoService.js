'use strict';
/* Services */

App.factory('$userInfo', ['Restangular', '$http', '$state', function( Restangular, $http, $state ) {
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
        university      : '/lawyers/university',
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
        return baseProfileURL(urlConfig.profile);
    };

    function getUserContacts(onSuccess, onError) {
        baseProfileURL(urlConfig.contacts).then(function(onFulfilled) {
            onSuccess(onFulfilled);
        },function(onReject) {
            onError(onReject);
        });
    };

    function getUserUniversity(onSuccess, onError) {
        baseProfileURL(urlConfig.university).then(function(onFulfilled) {
            onSuccess(onFulfilled);
        },function(onReject) {
            onError(onReject);
        });
    };

    function getUserCertificates(onSuccess, onError) {
        baseProfileURL(urlConfig.certificates).then(function(onFulfilled) {
            onSuccess(onFulfilled);
        },function(onReject) {
            onError(onReject);
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
            var _jsonData = angular.fromJson(data);
            if ( !isAuthenticated(_jsonData) ) return;

            switch (data.config.url) {
                case urlConfig.profile:
                    info['profile'] = _jsonData['data'];
                    return _jsonData['data'];
                    break;
                case  urlConfig.contacts:
                    info['contacts'] = _jsonData['data'];
                    break;
                case urlConfig.university:
                    info['universities'] = _jsonData['data'];
                    break;
                case urlConfig.certificates:
                    info['certificates'] = _jsonData['data'];
                    break;
                default:
                    onError(data);
                    break;
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
        onSuccess           : onSuccess,
        onError             : onError,
        profile             : {},
        contacts            : {},
        university          : {},
        certificates        : {},
        allowed             : false
    };
    return info;
}]);