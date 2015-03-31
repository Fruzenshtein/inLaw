'use strict';
/* Controller */


App.controller('FiltersCtrl', ['$scope', '$http', '$userInfo', 'LanguagesList', '$filterService',
    function ($scope, $http, $userInfo, LanguagesList, $filterService) {

        $scope.formats = ['yyyy', 'DD/MM/YYYY', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.filters = {};
        $scope.tableState = {
            isFound: false,
            isEmpty: false
        };
        $scope.competences = [];
        $scope.genderTypes = [ //TODO: get from the server
            { name: 'Male', id: 'm' },
            { name: 'Female', id: 'f' }
        ];
        $scope.languages = LanguagesList.languages;

        $scope.refreshAddresses = function(address) {
            var params = {address: address, sensor: false, language: 'uk'}; //TODO: Update locale on the localization phase
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function(response) {
                    $scope.addresses = response.data.results;
                });
        };
        $scope.refreshCompetences = function(search) {
            var params = {competence: search};
            return $http.get(
                '/competences', {params: params}
            ).then(function(response) {
                    $scope.competences = response.data;
                });
        };

        $scope.clear = function() {
            $scope.address.selected = undefined;
            $scope.gender.selected = undefined;
            $scope.language.selected = undefined;
        };

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
                if (_.isNull(data[index]['profile']['birthDate'])) return;
                data[index]['profile']['birthDate'] = moment(new Date(data[index]['profile']['birthDate'])).format($scope.formats[1]);
            });
            return data;
        };

        function checkAvatar(data) {
            angular.forEach(data, function(elem, index) {
                if (_.isNull(data[index]['avatar'])) {
                    // TODO add constant to CONSTANT object
                    data[index]['avatar'] = 'assets/devbuild/images/mock_64.svg';
                }
            });
            return data;
        };
        $scope.getSelectedLawyer = function(lawyerID) {
            $filterService.saveSelectedLawyer(lawyerID);
        };
        $scope.getResults = function() {
            // TODO: send just 'filter' object. Waiting backend support for multiple chaises.
            var params = {
                "city": $scope.filters.address
                    ? $scope.filters.address.selected.address_components[0].long_name
                    : undefined,
                "gender": $scope.filters.gender
                    ? $scope.filters.gender.selected.id
                    : undefined,
                "firstName": $scope.filters.firstName,
                "lastName": $scope.filters.lastName,
                "competence": $scope.filters.competence
                    ? $scope.filters.competence.selected[0]
                    : undefined,
                "language": $scope.filters.language
                    ? $scope.filters.language.selected.name
                    : undefined,
                "minRate": $scope.filters.rangeMin,
                // "maxRate": $scope.filters.rangeMax, TODO: backEnd support is needed
                "yearMin": $scope.filters.wRangeMin,
                "yearMax": $scope.filters.wRangeMax,
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
                    $scope.searchResponse = checkAvatar(data);
                    // Save filter results to Service
                    $filterService.saveFoundLawyers(data);
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        };

    }]);
