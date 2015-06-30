'use strict';
/* Service */

// The factory returns promise for MarketPlace
App.factory('MarketPlaceService', function($http) {

    function getLegalIssues() {
      return $http.get('/api/...');
    };

    function createLegalIssue(marketTask) {
      return $http.post('/api/...', marketTask);
    };

    function updateLegalIssue(marketTask) {
      return $http.post('/api/...', marketTask);
    };

    function deleteLegalIssue(id) {
      return $http.delete('/api/.../' + id);
    };

    function deleteTaskOfLegalIssue(id) {
      return $http.delete('/api/.../' + id);
    };

    function saveLegalIssueToStorage(obj) {
      var objStr = angular.toJson(obj);
      localStorage.setItem('legalIssue', objStr);
    };

    function getLegalIssueFromStorage() {
      return angular.fromJson(localStorage.getItem('legalIssue'));
    };


    return {
      getLegalIssues : getLegalIssues,
      createLegalIssue :createLegalIssue,
      updateLegalIssue : updateLegalIssue,
      deleteLegalIssue: deleteLegalIssue,
      deleteTaskOfLegalIssue: deleteTaskOfLegalIssue,
      saveLegalIssueToStorage: saveLegalIssueToStorage,
      getLegalIssueFromStorage: getLegalIssueFromStorage
    }

});