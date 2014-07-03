'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('DiogenisSecreteryTeacher', ['$scope', '$routeParams',
  function($scope, $routeParams) {

    $scope.teachers = [
        {username: 'iatrelis@cs.teilar.gr', name: 'Omiros Iatrelis'}
    ];

    $scope.modalTeacher;

    $scope.addTeacher = function(newTeacher) {
        $scope.teachers.push({
            username: newTeacher[0].username,
            name: newTeacher[0].name
        });
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
            var newTeacher = [ {
                username: teacherEmail,
                name: teacherName
            }];

            $modalInstance.close(newTeacher);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

  }]);
