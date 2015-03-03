'use strict';
/* Controller */

App.controller('CompetenceCtrl', ['$scope', '$http', '$userInfo', '$timeout',
    function ($scope, $http, $userInfo, $timeout) {

        $scope.myCompetences = {};
        $scope.myCompetences.competences = [];
        $scope.competences = [];
        // if data had saved before, do not send a request
        if ( _.isEmpty($userInfo.competences) ) {
            var promiseGetCompetences = $userInfo.getUserCompetences();
            promiseGetCompetences.then(function (onFulfilled) {
                $scope.myCompetences.competences = onFulfilled || [];
            }, function (onReject) {
                $scope.myCompetences.competences = [];
            });
        };

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
     /*
        $scope.competences = [ //TODO: get from the server the list of labels
            "Криминалньое",
            "Земельное",
            "Нотариус"
        ];
     */


    }]);