'use strict';
/* Service */

App.service('LoginModalService', function ($modal, $rootScope) {

    function assignCurrentUser (user) {
        $rootScope.currentUser = user.token || sessionStorage.getItem('token');
        return user;
    };

    return function() {
        var instance = $modal.open({
            templateUrl: 'assets/devbuild/assets/components/login/loginModal.html',
            controller: 'LoginModalCtrl',
            controllerAs: 'LoginModalCtrl'
        });

        return instance.result.then(assignCurrentUser);
    };

});