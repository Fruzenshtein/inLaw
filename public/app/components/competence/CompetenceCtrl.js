'use strict';
/* Controller */

App.controller('CompetenceCtrl', ['$scope', '$http', '$userInfo',
    function ($scope, $http, $userInfo) {

        $scope.disabled = undefined;
        $scope.enable = function() {
            $scope.disabled = false;
        };
        $scope.disable = function() {
            $scope.disabled = true;
        };
        $scope.competences = [ //TODO: get from teh server
            {name: "Криминалньое"},
            {name: "Земельное"},
            {name: "Нотариус"}
        ];

    }]);