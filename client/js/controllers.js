'use strict';

/* Controllers */

var diogenisControllers = angular.module('diogenisControllers', []);

diogenisControllers.controller('DiogenisLoginCtrl', ['$scope', '$routeParams', 'Person', '$location', '$cookieStore',
  function($scope, $routeParams, Person, $location, $cookieStore) {

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
          $cookieStore.put('type', 'secretary');
          $location.path('/secretary');
        } else {
          var teacherLogin = Person.loginTeacher(credentials);
          teacherLogin.$promise.then(function(data) {
            if (data && data.error.id == -1 && data.auth.success) {
              $scope.alerts.push({msg: "Συνδεθήκατε επιτυχώς", type: 'success'})
              $cookieStore.put('type', 'teacher');
              $cookieStore.put('id', data.user.id);
              $location.path('/teacher')
            } else {
              var studentLogin = Person.loginStudent(credentials);
              studentLogin.$promise.then(function(studentData) {
                if (studentData && studentData.error.id == -1 && studentData.auth.success) {
                    $scope.alerts.push({msg: "Συνδεθήκατε επιτυχώς", type: 'success'})
                    $cookieStore.put('type', 'student');
                    $cookieStore.put('id', studentData.student.id);
                    $location.path('/student')
                } else {
                  $scope.alerts.push({msg: "Η σύνδεση απέτυχε", type: 'danger' })
                }
              });
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
