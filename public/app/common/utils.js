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

    function convertDate(object, format) {
        var format = format || 'YYYY';

        if ( _.isArray(object) ) {
            angular.forEach(object, function(elem, index) {
                // Server receives only 'DD/MM/YYYY' format
                if ( _.isObject(elem) && _.isEmpty(elem) ) return;
                object[index].startDate = moment(object[index].startDate).format(format);
                object[index].endDate = moment(object[index].endDate).format(format);
            });
        }
        if (object.constructor == Object && object != null && !_.isEmpty(object)) {
            object.startDate = moment(object.startDate).format(format);
            object.endDate = moment(object.endDate).format(format);
        }

        return object;
    }

    function validateInputPair(_min, _max) {

    };

    return {
        generateYears: generateYears,
        convertDate: convertDate

    }
});
