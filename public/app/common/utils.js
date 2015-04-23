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
                switch (true) {
                    case elem.hasOwnProperty('startDate'):
                        elem.startDate = moment(elem.startDate).format(format);
                    case elem.hasOwnProperty('endDate'):
                        elem.endDate = moment(elem.endDate).format(format);
                    case elem.hasOwnProperty('date'):
                        elem.date = moment(elem.date).format(format);
                        break;
                    default: break;
                }
            });
        }
        if (object.constructor == Object && object != null && !_.isEmpty(object)) {
            switch (true) {
                case object.hasOwnProperty('startDate'):
                    object.startDate = moment(object.startDate).format(format);
                case object.hasOwnProperty('endDate'):
                    object.endDate = moment(object.endDate).format(format);
                case object.hasOwnProperty('date'):
                    object.date = moment(object.date).format(format);
                    break;
                default:
                    break;
            }
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
