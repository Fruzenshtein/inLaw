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