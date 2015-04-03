'use strict';
/* Controller */

App.controller('LoginModalCtrl', ['$scope', '$http',
    function ($scope, $http) {

    this.cancel = $scope.$dismiss;

    this.submit = function (email, password) {
        var data = {
            'email': email,
            'password': password
        };
        $http({
            method: 'POST',
            url: '/auth/login',
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).then(function (user) {
            $scope.$close(user);
        });

    };

}]);