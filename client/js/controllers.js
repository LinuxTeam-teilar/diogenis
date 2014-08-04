'use strict';

/* Controllers */

var diogenisControllers = angular.module('diogenisControllers', []);

diogenisControllers.controller('DiogenisSecreteryTeacher', ['$scope', '$routeParams',
  function($scope, $routeParams) {

    $scope.teachers = [
        {username: 'iatrelis@cs.teilar.gr', name: 'Omiros Iatrelis'}
    ];

    $scope.teacherExists = false;
    $scope.addTeacher = function(newTeacher) {
        if (angular.toJson(this.teachers).indexOf(newTeacher.username) >=0) {
            $scope.teacherExists = true;
        } else {
            $scope.teachers.push({
                username: newTeacher.username,
                name: newTeacher.name
            });
        }
    }

    $scope.ModalDemoCtrl = function ($scope, $modal, $log) {
        $scope.open = function () {
            var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: $scope.ModalInstanceCtrl,
            });

            modalInstance.result.then(function (newTeacher) {
                $scope.addTeacher(newTeacher)
            });
        };
    };

    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.ok = function (teacherEmail, teacherName) {
            var newTeacher = {
                username: teacherEmail,
                name: teacherName
            };

            $modalInstance.close(newTeacher);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };


    $scope.AlertComponentCtrl = function($scope) {
        $scope.alerts = [
            { type: 'alert round', msg: 'Teacher already exists!' }
        ];

        $scope.addAlert = function() {
            $scope.alerts.push({msg: "Another alert!"});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }

  }]);

diogenisControllers.controller('DiogenisLoginCtrl', ['$scope', '$routeParams', 'Person',
  function($scope, $routeParams, Person) {


    $scope.loginResult;

    $scope.requestLogin = function(personEmail, personPassword) {

      var credentials = {
        username: personEmail,
        password:personPassword
      }

      var secretaryLogin = Person.loginSecretary(credentials);
      secretaryLogin.$promise.then(function(result) {
        //remove the previous alert
        $scope.alerts = []
        if (result && result.error.id == -1 && result.auth.success) {
          $scope.alerts.push({msg: "Συνδεθήκατε επιτυχώς", type: 'success'})
        } else {
          var teacherLogin = Person.loginTeacher(credentials);
          teacherLogin.$promise.then(function(data) {
            if (data && data.error.id == -1 && data.auth.success) {
              $scope.alerts.push({msg: "Συνδεθήκατε επιτυχώς", type: 'success'})
            } else {
              $scope.alerts.push({msg: "Η σύνδεση απέτυχε", type: 'danger' })
            }
          });
        };
      });
    }

    $scope.alerts = [];
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

  }]);
