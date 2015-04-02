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