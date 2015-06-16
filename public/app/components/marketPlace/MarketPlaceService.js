'use strict';
/* Service */

// The factory returns promise for MarketPlace
App.factory('MarketPlaceService', function($http) {
        return {
            get : function() {
                return $http.get('/api/...');
            },
            create : function(marketTask) {
                return $http.post('/api/...', marketTask);
            },
            delete : function(id) {
                return $http.delete('/api/.../' + id);
            }
        }
    });