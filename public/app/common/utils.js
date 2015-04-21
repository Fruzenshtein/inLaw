"use strict";
/* Factory */

App.factory('UtilsService', function() {

    /**
     * The function returns array of years from today to 80 year back
     * @param min
     * @param max
     * @returns {Array}
     */
    function generateYears(min, max) {
        var min = min || new Date().getFullYear() - 80,
            max = max || new Date().getFullYear(),
            arrayOfYears = [];

        for (var i = min; i <= max; i++) {
            arrayOfYears.push(i+''); // convert years (int) to string
        };
        return arrayOfYears;
    };

    function convertDate(arrayOfObjects, format) {
        var format = format || 'YYYY';

        angular.forEach(arrayOfObjects, function(elem, index) {
            // Server receives only 'DD/MM/YYYY' format
            if ( _.isObject(elem) && _.isEmpty(elem) ) return;
            arrayOfObjects[index].startDate = moment(arrayOfObjects[index].startDate).format(format);
            arrayOfObjects[index].endDate = moment(arrayOfObjects[index].endDate).format(format);
        });
        return arrayOfObjects;
    }

    function validateInputPair(_min, _max) {

    };

    return {
        generateYears: generateYears,
        convertDate: convertDate

    }
});
