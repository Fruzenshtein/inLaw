'use strict';
/* Controller - part of My Account (manage legal services), visible for lawyer, not a user */

App.controller('MarketPlaceLawyerCtrl', ['$scope', '$http', 'MarketPlaceService',
  function ($scope, $http, MarketPlaceService) {

    var taskCounter = 0;
    $scope.tasksInLegalIssue = [];
    $scope.allLegalIssues = [];
    $scope.taskTitle = {};
    this.taskStatus =  {
      isActive: false
    };

    $scope.addNewTask = function() {
      var task = angular.copy($scope.taskTitle);
      // assign ID to added task
      task.id = taskCounter;
      $scope.tasksInLegalIssue.push(task);
      taskCounter += 1;
    };

    $scope.getElement = function(obj) {
      $scope.taskDetail = obj;
    };

    $scope.removeTask = function(obj) {
      angular.forEach($scope.tasksInLegalIssue, function(elem, index) {
        // if user added a form that not saved on the server yet, just delete UI
        if ($scope.tasksInLegalIssue.length != $scope.tasksInLegalIssue.length &&
            $scope.tasksInLegalIssue[index]['id'] == obj['id']) {
          $scope.tasksInLegalIssue.splice(index, 1);
          return;
        }
        if ( $scope.tasksInLegalIssue[index]['id'] == obj['id'] ) {
          $http({
            method: 'DELETE',
            url: '/api/..' + obj['id'],
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          }).
              success(function (data, status, headers, config) {
                $scope.tasksInLegalIssue.splice(index, 1);
              }).
              error(function (data, status, headers, config) {
                $scope.error = 'Unexpected error. Please try again later.';
              });
        }
      })

    };

  }]);