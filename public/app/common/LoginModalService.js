'use strict';
/* Service */

App.service('LoginModalService', function ($modal, $rootScope) {

    function assignCurrentUser (user) {
        sessionStorage.setItem('token', user.data.token);
        $rootScope.currentUser = user.data.token || sessionStorage.getItem('token');
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