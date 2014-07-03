'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('DiogenisSecreteryTeacher', ['$scope', '$routeParams',
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
