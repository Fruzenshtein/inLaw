'use strict';
/* Controller */

App.controller('LanguagesCtrl', ['$scope', '$http', '$userInfo', '$timeout',
    function ($scope, $http, $userInfo) {

        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.languages) ) {
            var promiseGetLanguages = $userInfo.getUserLanguages();
            promiseGetLanguages.then(function (onFulfilled) {
                $scope.languages = onFulfilled || [];
            }, function (onReject) {
                $scope.languages = [];
            });
        };
        $scope.languagesModel = {};
        $scope.language = {};
        $scope.languages = [
            { language: 'United States' },
            { language: 'Argentina' },
            { language: 'Colombia' },
            { language: 'Ecuador' }
        ];
        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        $scope.tagTransform = function (newTag) {
            var item = {
                language: newTag.toLowerCase()
            };
            return item;
        };
        $scope.addLanguages = function(languages) {
            $http({
                method:  'POST',
                url: '/lawyers/languages',
                data: languages,
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