'use strict';
/* Controller */

App.controller('CompetenceCtrl', ['$scope', '$http', '$userInfo', '$timeout',
    function ($scope, $http, $userInfo, $timeout) {

        $scope.disabled = undefined;
        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        $scope.myCompetences = {};
        $scope.myCompetences.competences = [  //TODO: get from the server for particular user
            "Криминалньое"
        ];
        $scope.competences = [ //TODO: get from the server the list of labels
            "Криминалньое",
            "Земельное",
            "Нотариус"
        ];


    }]);