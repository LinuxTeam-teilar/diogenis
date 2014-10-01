/*
Copyright 2014 Antonis Tsiapaliokas <antonis.tsiapaliokas@kde.org>
Copyright 2014 Giorgos Tsiapaliokas <giorgos.tsiapaliokas@kde.org>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

/* Controllers */

var diogenisControllers = angular.module('diogenisControllers', []);

diogenisControllers.controller('DiogenisLoginCtrl', ['$scope', '$routeParams', 'Person', '$location', '$cookieStore',
  function($scope, $routeParams, Person, $location, $cookieStore) {

    $scope.loginResult;

    var userType = $cookieStore.get('type');

    switch (userType) {
      case 'teacher':
        $location.path('/teacher');
        break;
      case 'secretary':
        $location.path('/secretary');
        break;
      case 'student':
        $location.path('/student');
        break;
    }

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
          $cookieStore.put('fullName', result.user.username);
          $cookieStore.put('departmentId', result.user.departmentId);
          $location.path('/secretary');
        } else {
          var teacherLogin = Person.loginTeacher(credentials);
          teacherLogin.$promise.then(function(data) {
            if (data && data.error.id == -1 && data.auth.success) {
              $scope.alerts.push({msg: "Συνδεθήκατε επιτυχώς", type: 'success'})
              $cookieStore.put('type', 'teacher');
              $cookieStore.put('id', data.user.id);
              $cookieStore.put('fullName', data.user.username);
              $location.path('/teacher')
            } else {
              var studentLogin = Person.loginStudent(credentials);
              studentLogin.$promise.then(function(studentData) {
                //FIXME why does it return false?
                if (studentData && studentData.error.id == -1 && studentData.auth.success) {
                    $scope.alerts.push({msg: "Συνδεθήκατε επιτυχώς", type: 'success'})
                    $cookieStore.put('type', 'student');
                    $cookieStore.put('id', studentData.student.id);
                    $cookieStore.put('studentAM', studentData.student.identity);
                    $cookieStore.put('fullName', studentData.student.username);
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

