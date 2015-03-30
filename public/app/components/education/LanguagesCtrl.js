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