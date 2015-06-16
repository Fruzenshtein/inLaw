'use strict';
/* Controller - part of My Account (manage legal services), visible for lawyer, not a user */

App.controller('MarketPlaceLawyerCtrl', ['$scope', '$http', 'MarketPlaceService',
    function ($scope, $http, MarketPlaceService) {

        $scope.formData = {};

        // when landing on the page, get all todos and show them
        /*
        MarketPlaceService.get()
            .success(function(data) {
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        $scope.createMarket = function() {
            MarketPlaceService.create($scope.formData)
                .success(function(data) {
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.todos = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

        // delete a todo after checking it
        $scope.deleteMarket = function(id) {
            MarketPlaceService.delete(id)
                .success(function(data) {
                    $scope.todos = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };


        //------

        var todos = $scope.todos = todoStorage.get();

        $scope.newTodo = '';
        $scope.remainingCount = $filter('filter')(todos, {completed: false}).length;
        $scope.editedTodo = null;

        if ($location.path() === '') {
            $location.path('/');
        }

        $scope.location = $location;

        $scope.$watch('location.path()', function (path) {
            $scope.statusFilter = { '/active': {completed: false}, '/completed': {completed: true} }[path];
        });

        $scope.$watch('remainingCount == 0', function (val) {
            $scope.allChecked = val;
        });

        $scope.addTodo = function () {
            var newTodo = $scope.newTodo.trim();
            if (newTodo.length === 0) {
                return;
            }

            todos.push({
                title: newTodo,
                completed: false
            });
            todoStorage.put(todos);

            $scope.newTodo = '';
            $scope.remainingCount++;
        };

        $scope.editTodo = function (todo) {
            $scope.editedTodo = todo;
            // Clone the original todo to restore it on demand.
            $scope.originalTodo = angular.extend({}, todo);
        };

        $scope.doneEditing = function (todo) {
            $scope.editedTodo = null;
            todo.title = todo.title.trim();

            if (!todo.title) {
                $scope.removeTodo(todo);
            }

            todoStorage.put(todos);
        };

        $scope.revertEditing = function (todo) {
            todos[todos.indexOf(todo)] = $scope.originalTodo;
            $scope.doneEditing($scope.originalTodo);
        };

        $scope.removeTodo = function (todo) {
            $scope.remainingCount -= todo.completed ? 0 : 1;
            todos.splice(todos.indexOf(todo), 1);
            todoStorage.put(todos);
        };

        $scope.todoCompleted = function (todo) {
            $scope.remainingCount += todo.completed ? -1 : 1;
            todoStorage.put(todos);
        };

        $scope.clearCompletedTodos = function () {
            $scope.todos = todos = todos.filter(function (val) {
                return !val.completed;
            });
            todoStorage.put(todos);
        };

        $scope.markAll = function (completed) {
            todos.forEach(function (todo) {
                todo.completed = !completed;
            });
            $scope.remainingCount = completed ? todos.length : 0;
            todoStorage.put(todos);
        };
*/
    }]);