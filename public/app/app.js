'use strict';
/*  App block */

App.run(function ($rootScope, $state, AuthService) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin,
            currentUser = $rootScope.currentUser || AuthService.isAuthenticated();

        if ( requireLogin && !currentUser ) {
            $state.go('login');
        };

    });

});

App.config(function ($httpProvider) {

    $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
        var $http, $state;

        // this trick must be done so that we don't receive
        // `Uncaught Error: [$injector:cdep] Circular dependency found`
        $timeout(function () {
            $http = $injector.get('$http');
            $state = $injector.get('$state');
        });

        return {
            responseError: function (rejection) {
                var deferred = $q.defer();
                if (rejection.status == 401) {
                    $state.go('login');
                };
                deferred.reject(rejection);
                return deferred.promise;
            }
        };

    });

});
