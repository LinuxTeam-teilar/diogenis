'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisHelpCtrl', ['$scope', '$routeParams', '$http', '$route', '$location', '$filter', '$cookieStore', 'GenerateFullName',
  function($scope, $routeParams, $http, $route, $location, $filter, $cookieStore, GenerateFullName) {
  $scope.fullName = GenerateFullName;

  $scope.alerts = []
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.isUserLoggedIn = $cookieStore.get('fullName') !== undefined;
  $scope.sendMail = function() {
    //do something with the data.
    console.log($scope.fullName)
    console.log($scope.email)
    console.log($scope.message)
    console.log($scope.title)
    //clear the previous alerts
    $scope.alerts = [];
    $scope.alerts.push({msg: 'Το email στάλθηκε επιτυχώς, θα επικοινωνήσουμε σύστομα μαζί σας.', type: 'success'});
  }

  $scope.resetForm = function() {
    $scope.email = "";
    $scope.message = "";
    $scope.title = "";
  }
  }]);
