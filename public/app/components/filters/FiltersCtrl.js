'use strict';
/* Controller */


App.controller('FiltersCtrl', ['$scope', '$http', '$userInfo',
    function ($scope, $http, $userInfo) {

        $scope.filters = {};
        $scope.tableState = {
            isFound: false,
            isEmpty: false
        };
        $scope.refreshAddresses = function(address) {
            var params = {address: address, sensor: false, language: 'uk'}; //TODO: Update locale on the localization phase
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function(response) {
                    $scope.addresses = response.data.results;
                });
        };
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

        $scope.professions = [ //TODO: get from teh server
            {name: "Криминалньое"},
            {name: "Земельное"},
            {name: "Нотариус"}
        ];
        $scope.competences = [ //TODO: get from teh server
            {name: "Криминалньое"},
            {name: "Земельное"},
            {name: "Нотариус"}
        ];
        $scope.genderTypes = [ //TODO: get from teh server
            {name: 'Male'},
            {name: 'Famele'}
        ];
        $scope.languages = [ //TODO: get from teh server
            {name: 'Ukrainian'},
            {name: 'English'}
        ];
        $scope.formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

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
        $scope.resetFilter = function() {
            // Reset filters to default values
            $scope.filters = {};
        };

        function convertTime(data) {
            var data = data;
            if (_.isEmpty(data)) {
                return data;
            }
            angular.forEach(data, function(elem, index) {
                if (_.isNull(data[index].birthDate)) return;
                data[index].birthDate = moment(new Date(data[index].birthDate)).format($scope.formats[1]);
            });
            return data;
        };
        $scope.getResults = function() {
            var params = {
                // "city": $scope.filters.address ? $scope.filters.address.selected.name : undefined, TODO: backEnd support is needed
                "gender": $scope.filters.gender ? $scope.filters.gender.selected.name : undefined,
                "firstName": $scope.filters.firstName,
                "lastName": $scope.filters.lastName,
                "middleName": $scope.filters.middleName,
                // "birthDate": "", TODO: hided for now. Need clarification
                // "competence": $scope.filters.competence ? $scope.filters.competence.selected.name : undefined, TODO: backEnd support is needed
                // "profession": $scope.filters.profession ? $scope.filters.profession.selected.name : undefined, TODO: backEnd support is needed
                // "language": $scope.filters.language ? $scope.filters.language.selected.name : undefined, TODO: backEnd support is needed
                "minRate": $scope.filters.rangeMin,
                // "maxRate": $scope.filters.rangeMax, TODO: backEnd support is needed
                // "yearMin": $scope.filters.wRangeMin, TODO: backEnd support is needed
                // "yearMax": $scope.filters.wRangeMax, TODO: backEnd support is needed
                "availability": $scope.filters.availability
            };

            $http.get('/lawyers', { params: params })
                .success(function (data, status, headers, config) {
                    if ( _.isEmpty(data) ) {
                        $scope.tableState.isFound = false;
                        $scope.tableState.isEmpty = true
                    }
                    $scope.tableState.isFound = true;
                    $scope.tableState.isEmpty = false;
                    $scope.searchResponse = convertTime(data);
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        };

    }]);
