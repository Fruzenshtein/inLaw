'use strict';
/* Controller - part of My Account (manage legal services), visible for lawyer,
not for a user */

App.controller('MarketPlaceLawyerCtrl', ['$scope', '$http', 'MarketPlaceService',
  function ($scope, $http, MarketPlaceService) {

    var taskCounter = 0;
    $scope.legalServiceInProgress = MarketPlaceService.getLegalIssueFromStorage()
        ? MarketPlaceService.getLegalIssueFromStorage()
        : false;
    $scope.legalServiceTasks = [];
    $scope.taskTitle = {};
    this.formStatus = {
      isEditModeOpen: false
    };

    //Show appropriate wizard (animation) based on selected url
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $scope.wizardStatus = {};
      switch (toState.url) {
        case '/legal-services':
          $scope.wizardStatus.step1 = false;
          $scope.wizardStatus.step2 = true;
          $scope.wizardStatus.step3 = true;
          break;
        case '/create':
            console.log(2);
          $scope.wizardStatus.step1 = false;
          $scope.wizardStatus.step2 = false;
          $scope.wizardStatus.step3 = true;
          break;
        case '/confirm':
          console.log(3);
          $scope.wizardStatus.step1 = false;
          $scope.wizardStatus.step2 = false;
          $scope.wizardStatus.step3 = false;
          break;
        default:
          console.log(4);
          break;
      }
    });

    $scope.addNewTask = function() {
      var task = angular.copy($scope.taskTitle);
      // assign ID to added task
      task.id = taskCounter;
      $scope.legalServiceTasks.push(task);
      taskCounter += 1;
      // clear input after adding the task
      $scope.taskTitle.title = '';
    };

    $scope.getElement = function(obj, index) {
      // De-select active object if 'close' button clicked
      if ( !obj && !index ) {
        $scope.taskDetail = null;
        return;
      };
      // Save information about selected object for ng-class
      // and for Detail section
      $scope.taskDetail = obj;
      $scope.taskDetail.index = index;
    };

    $scope.removeTask = function(obj) {
      angular.forEach($scope.legalServiceTasks, function(elem, index) {
        // if user added a form that not saved on the server yet, just delete UI
        if ($scope.legalServiceTasks.length != $scope.legalServiceTasks.length &&
            $scope.legalServiceTasks[index]['id'] == obj['id']) {
          $scope.legalServiceTasks.splice(index, 1);
          return;
        }
        if ( $scope.legalServiceTasks[index]['id'] == obj['id'] ) {
          $http({
            method: 'DELETE',
            url: '/api/..' + obj['id'],
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          }).
              success(function (data, status, headers, config) {
                $scope.legalServiceTasks.splice(index, 1);
              }).
              error(function (data, status, headers, config) {
                $scope.error = 'Unexpected error. Please try again later.';
              });
        }
      })
    };

    $scope.saveLegalIssueToStorage = function() {
      MarketPlaceService.saveLegalIssueToStorage($scope.legalServiceTasks);
    };

  }]);