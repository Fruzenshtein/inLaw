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