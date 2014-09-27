'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisHelpCtrl', ['$scope', '$routeParams', '$http', '$route', '$location', '$filter', '$cookieStore', 'GenerateFullName',
  function($scope, $routeParams, $http, $route, $location, $filter, $cookieStore, GenerateFullName) {
  $scope.fullName = GenerateFullName;

  $scope.alerts = []
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.busyButton = false;
  $scope.isUserLoggedIn = $cookieStore.get('fullName') !== undefined;
  $scope.sendMail = function() {
    //clear the previous alerts
    $scope.alerts = [];

    var newMail = {
      subject: $scope.title,
      content: $scope.message,
      contactemail: $scope.email,
      accountname: $scope.fullName
    };

    $scope.busyButton = true;

    $http.post('contact/sendmail', newMail).
      success(function(result) {
      if (result.auth.success && result.error.id ===-1 && result.operation.status === 'ok' ) {
        $scope.alerts.push({msg: 'Το email στάλθηκε επιτυχώς, θα επικοινωνήσουμε σύστομα μαζί σας.', type: 'success'});
      } else {
        $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name, type: 'danger'});
      }

      $scope.busyButton = false;
    });
  }

  $scope.resetForm = function() {
    $scope.email = "";
    $scope.message = "";
    $scope.title = "";
  }
  }]);
