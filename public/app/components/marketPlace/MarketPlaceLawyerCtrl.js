'use strict';
/* Controller - part of My Account (manage legal services), visible for lawyer, not a user */

App.controller('MarketPlaceLawyerCtrl', ['$scope', '$http', '$filterService', '$location',
    function ($scope, $http, $filterService, $location) {

        $scope.formData = {};
/*
        // when landing on the page, get all todos and show them
        $http.get('/api/..')
            .success(function(data) {
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        $scope.createTodo = function() {
            $http.post('/api/..', $scope.formData)
                .success(function(data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.todos = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

        // delete a todo after checking it
        $scope.deleteTodo = function(id) {
            $http.delete('/api/../' + id)
                .success(function(data) {
                    $scope.todos = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
*/


    }]);