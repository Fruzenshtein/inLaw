'use strict';
/* Controller */


App.controller('FiltersCtrl', ['$scope', '$http', '$userInfo',
    function ($scope, $http, $userInfo) {

        $scope.disabled = undefined;

        $scope.enable = function() {
            $scope.disabled = false;
        };

        $scope.disable = function() {
            $scope.disabled = true;
        };

        $scope.clear = function() {
            $scope.address.selected = undefined;
            $scope.gender.selected = undefined;
            $scope.language.selected = undefined;
        };

        $scope.address = {};
        $scope.refreshAddresses = function(address) {
            var params = {address: address, sensor: false, language: 'uk'};
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function(response) {
                    $scope.addresses = response.data.results;
                });
        };

        $scope.profession = {};
        $scope.professions = [ //TODO: get from teh server
            {name: "Криминалньое"},
            {name: "Земельное"},
            {name: "Нотариус"}
        ];
        $scope.competence = {};
        $scope.competences = [ //TODO: get from teh server
            {name: "Криминалньое"},
            {name: "Земельное"},
            {name: "Нотариус"}
        ];

        $scope.gender = {};
        $scope.genderTypes = [ //TODO: get from teh server
            {name: 'Male'},
            {name: 'Famele'}
        ];
        $scope.language = {};
        $scope.languages = [ //TODO: get from teh server
            {name: 'Ukrainian'},
            {name: 'English'}
        ];

        $scope.additionalFl = {};
        $scope.validateInputPair = function(_min, _max) {
            var min = $scope.additionalFl[_min],
                max = $scope.additionalFl[_max];

            function setInvalid() {
                $scope[_min].invalid = true;
            }

            $scope[_min] = {};
            if ((!!min && !max && max !== 0) || (!!max && !min && min !== 0)) {
                $scope[_min].requiredBothError = true;
                setInvalid()
            }
            if (!_.isNaN(+min) && !_.isNaN(+max)) {
                if (+max < +min) {
                    $scope[_min].pairError = true;
                    setInvalid();
                }
            } else {
                setInvalid();
            }
        };
        $scope.removeFilter = function(filter) {
            //TODO: reset all filters to default values
        };


    }]);
