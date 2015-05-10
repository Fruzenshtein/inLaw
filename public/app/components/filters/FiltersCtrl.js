'use strict';
/* Controller */


App.controller('FiltersCtrl', ['$scope', '$http', '$userInfo', 'LanguagesList', '$filterService',
    '$timeout',
    function ($scope, $http, $userInfo, LanguagesList, $filterService, $timeout) {

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
            // rewrite form obj to needed format
            var params = angular.copy($scope.filters);
            delete params.address; // delete google obj
            params.city = $scope.filters.address
                ? $scope.filters.address.selected.address_components[0].long_name
                : undefined;
            params.gender = $scope.filters.gender
                ? $scope.filters.gender.id
                : undefined;
            $http.post('/lawyers/filter', params)
                .success(function (data, status, headers, config) {
                    if ( _.isEmpty(data) ) {
                        $scope.tableState.isFound = false;
                        $scope.tableState.isEmpty = true;
                        return;
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

        // *** JQUERY ****

        $('.ui.checkbox')
            .checkbox({
                'onChange': function() {
                    $scope.filters.availability = ! $scope.filters.availability
                }
            });

        // ***************

        $scope.show = false;
        $timeout(function() {
            $scope.show  = true;
        }, 1000);
        $scope.id = "bob";
        $scope.id2 = "bob";
        $scope.value = "10;50";
        $scope.value2 = "12;15";
        $scope.value3 = "10;12";
        $scope.value4 = "999;1700";
        $scope.value5 = "10;20";
        $scope.value6 = "10;53";
        $scope.valueVisibility = "40;70";
        $scope.disa = true;
        $scope.disabledtoto = false;
        $scope.data = {
            quote: {
                coverages: {
                    coverageA: 200000
                }
            }
        };
        $scope.defaultAmount=190000;
        $scope.coverageASliderOptions = {
            from: $scope.defaultAmount,
            to: $scope.defaultAmount+ ($scope.defaultAmount* 0.20),
            step: 500,
            calculate: function(value) {
                return $filter('currency')(value, '$', 0);
            }
        };
        $scope.disable = function() {
            $scope.disabledtoto = !$scope.disabledtoto;
        };
        $scope.toggleVisibility = function () {
            $scope.show = !$scope.show;
        };
        var calculate = function( value ) {
            var hours = Math.floor( value / 60 );
            var mins = ( value - hours*60 );
            return (hours < 10 ? "0"+hours : hours) + ":" + ( mins == 0 ? "00" : mins );
        };
        $scope.options = {
            to: 40,
            from: 0,
            step: 1,
            dimension: " km",
            vertical: false,
            scale: [0, '|', 10, '|', 20, '|' , 30, '|', 40],
            // round: 2,
            skin: 'round',
            modelLabels: {1: 'test1', 2: 'test3'},
            realtime: true,
            /*css: {
             background: {'background-color': 'yellow'},
             before: {'background-color': 'purple'},
             default: {'background-color': 'white'},
             after: {'background-color': 'green'},
             pointer: {'background-color': 'red'}
             },*/
            limits: false,
            callback: function(value, released) {
                console.log(value + " " + released);
            }
        };
        $scope.optionsVisibility = {
            from: 10,
            to: 100,
            step: 1,
            dimension: ' min',
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.optionsCss = {
            from: 1,
            to: 100,
            step: 1,
            dimension: " km",
            vertical: false,
            css: {
                background: {'background-color': 'yellow'},
                before: {'background-color': 'purple'},
                default: {'background-color': 'white'},
                after: {'background-color': 'green'},
                pointer: {'background-color': 'red'}
            },
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.optionsV = {
            from: 0,
            to: 40,
            step: 0.5,
            dimension: " $",
            round: 1,
            skin: 'jslider_blue',
            scale: [0, '|', 10, '|', 20, '|' , 30, '|', 40],
            vertical: true,
            /*css: {
             background: {"background-color": "yellow"},
             before: {"background-color": "purple"},
             default: {"background-color": "blue"},
             after: {"background-color": "green"},
             pointer: {"background-color": "red"}
             },*/
            callback: function(value, elt) {
                console.log(value);
                console.log(elt);
            }
            // calculate: calculate
        };
        $scope.options2 = {
            from: 0,
            to: 100,
            floor: true,
            step: 10,
            dimension: " km",
            css: {
                background: {"background-color": "yellow"},
                before: {"background-color": "purple"},
                default: {"background-color": "white"},
                after: {"background-color": "green"},
                pointer: {"background-color": "red"}
            },
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.options2V = {
            from: 1,
            to: 100,
            floor: true,
            step: 10,
            dimension: " km",
            vertical: true,
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.options2VCSS = {
            from: 1,
            to: 100,
            floor: true,
            step: 10,
            dimension: " km",
            vertical: true,
            css: {
                background: {"background-color": "yellow"},
                before: {"background-color": "purple"},
                default: {"background-color": "blue"},
                after: {"background-color": "green"},
                pointer: {"background-color": "red"}
            },
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.options3 = {
            from: 700,
            to: 2100,
            step: 1,
            smooth: false,
            dimension: " mb",
            callback: function(value, elt) {
                console.log(value);
            }
        };
        $scope.changeOptions = function() {
            $scope.options = {
                from: 0,
                to: 80,
                step: 1,
                dimension: " $",
                scale: [0, '|', 10, '|', 20, '|' , 30, '|', 40, '|', 50, '|', 60, '|', 70, '|', 80]
            };
        };
        $scope.changeValue = function() {
            $scope.value = "11;15";
            $scope.value2 = "13;15";
            $scope.value3 = 20;
            $scope.value4 = "700;1000";
        };


        //****************



    }]);
