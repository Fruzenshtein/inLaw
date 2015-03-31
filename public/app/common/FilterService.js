'use strict';
/* Services */

App.factory('$filterService', ['$http', '$state', '$q',
    function( $http, $state ) {

        var listOfFoundLawyers = [],
            selectedLawyerID = '',
            selectedLawyerObj = {};

        function saveFoundLawyers(array) {
            if (_.isArray(array) && _.isEmpty(array)) return;
            listOfFoundLawyers = array;
        };
        function saveSelectedLawyer(lawyerID) {
            selectedLawyerID = lawyerID.id;
        };
        function getSelectedLawyerObj() {
            angular.forEach(listOfFoundLawyers, function(elem, index) {
                if (selectedLawyerID === elem['id']) {
                    selectedLawyerObj = elem;
                }
            });
            return selectedLawyerObj;
        };

        return {
            selectedLawyerObj    : selectedLawyerObj,
            listOfFoundLawyers   : listOfFoundLawyers,
            saveFoundLawyers     : saveFoundLawyers,
            saveSelectedLawyer   : saveSelectedLawyer,
            getSelectedLawyerObj : getSelectedLawyerObj
        }

    }]);