'use strict';
/* Controller */

App.controller('ContactsCtrl', ['$scope', '$http',
    '$filter', '$userInfo', 'ValidationRules', function ($scope, $http, $filter, $userInfo, ValidationRules) {

        // Default template for phone number
        var defaultPhoneTemplate = [
            {
                id: '',
                name: '',
                number: ''
            }
        ],
            googleCityTemplate = {
                "selected": {
                    "address_components" : [
                        {
                            "long_name" : "",
                            "short_name" : "",
                            "types" : [ ]
                        }
                    ]
                }
            },
            googleCountryTemplate = {
                "selected": {
                    "address_components" : [
                        {
                            "long_name" : "",
                            "short_name" : "",
                            "types" : [ ]
                        }
                    ]
                }
            };

        // if data saved before do not send request
        if (_.isEmpty($userInfo.contacts)) {
            var promiseGetContacts = $userInfo.getUserContacts();
            promiseGetContacts.then(function (onFulfilled) {
                // if an object contains 'message' key it means that no data exists
                $scope.userContacts = onFulfilled.message ? {} : onFulfilled;
                setAddresses($scope.userContacts);
                $scope.userContacts.phones = onFulfilled.phones ? onFulfilled.phones : defaultPhoneTemplate;
            }, function (onReject) {
                $scope.userContacts = {};
            });
        };
        $scope.userContacts = $userInfo.contacts || {};
        $scope.country = {};
        $scope.city = {};
        $scope.formStatus = {
            isEditModeOpen: true,
            isEditModeDisabled: false
        };
        function setAddresses(data) {
            switch (true) {
                case _.isEmpty(data):
                    break;
                case !!data.city:
                    googleCityTemplate.selected.address_components[0].long_name = data.city;
                    $scope.city = googleCityTemplate;
                case !!data.country:
                    googleCountryTemplate.selected.address_components[0].long_name = data.country;
                    $scope.country = googleCountryTemplate;
                    break;
            };

        };
        $scope.refreshCountry = function(address) {
            var params = {address: address, sensor: false, language: 'uk'}; //TODO: Update locale on the localization phase
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function(response) {
                    $scope.countries = response.data.results;
                });
        };
        $scope.refreshCity = function(address) {
            var params = {address: address, sensor: false, language: 'uk'}; //TODO: Update locale on the localization phase
            return $http.get(
                'http://maps.googleapis.com/maps/api/geocode/json',
                {params: params}
            ).then(function(response) {
                    $scope.cities = response.data.results;
                });
        };
        $scope.userContacts.phones = $userInfo.contacts.phones || defaultPhoneTemplate;
        $scope.addPhone = function (phoneNumber) {
            var template = { id: '', name: '', number: '' },
                isUnique = isNumberUnique(phoneNumber);
            if (isUnique) {
                $scope.userContacts.phones.push(template);
            };
        };

        function isNumberUnique(value) {
            if (value == '') return;
            var array = $scope.userContacts.phones,
                uniqArray = _.uniq(array, 'number');

            return array.length == uniqArray.length;
        };
        $scope.updateContacts = function () {
            var contacts = angular.copy($scope.userContacts);
            contacts.city = $scope.city.selected
                ? $scope.city.selected.address_components[0].long_name : undefined;
            contacts.country = $scope.country.selected
                ? $scope.country.selected.address_components[0].long_name : undefined;

            $http({
                method: 'PUT',
                url: '/lawyers/contacts',
                data: contacts,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            }).
                success(function (data, status, headers, config) {
                    $scope.formStatus.isEditModeOpen = true;
                    $scope.isUpdated = true;
                    $scope.error = false;
                }).
                error(function (data, status, headers, config) {
                    $scope.error = 'Unexpected error. Please try again later.';
                });
        };

        // *** JQUERY SECTION ***

        // Profile form validation
        (function ($) {
            $('.ui.form')
                .form(ValidationRules.uk);
        })(jQuery);

    }]);