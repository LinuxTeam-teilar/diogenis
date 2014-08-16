'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisSecretaryCtrl', ['$scope', '$routeParams', '$resource', '$location',
  function($scope, $routeParams, $resource, $location) {

    $scope.navs = [
      { title: "Καθηγητές", visible: true, partial: "partials/_secretary_teacher.html"},
      { title: "Μαθήματα", visible : false, partial: "partials/_secretary_leasson.html"}
    ];

    $scope.changeNav = function(item) {
      if (item.visible) {
        //don't disable the current nav
        return;
      } else {
        angular.forEach($scope.navs, function(value, key) {
          //disable the current nav
          if (value.visible) {
            value.visible = false;
          }

          item.visible = true;
        });
      }
    };

    //Teacher Modal
    $scope.ModalDemoCtrl = function ($scope, $modal, $log) {

      $scope.alerts = []
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

      $scope.open = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'bar.html',
          controller: $scope.ModalInstanceCtrl,
          size: size,
          resolve: {
            alerts: function() {
              return $scope.alerts;
            }
          }
        });

        modalInstance.result.then(function (newTeacher) {
          newTeacher.$save().then(function(result) {
            //clear the alerts
            $scope.alerts = [];

            if (result.error.id == 4 && result.error.name == "CreationFailed") {
              $scope.alerts.push({ msg: "Ο καθητής υπαρχεί ήδη", type: 'danger'});
            } else if (result.error.id == -1 && result.auth.success) {
              $scope.alerts.push({msg : "Ο καθητής δημιουργήθηκε επιτυχώς", type: "success"});
            } else {
              $scope.alerts.push({msg : "Σφάλμα συστήματος " + result.error, type: "danger"});
            }
          }, function(error) {
            if (error.status == 401) {
              $location.path('/')
              //Unathorized attemp.Redirect to /home
            }
          });

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    };

    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance) {
      $scope.ok = function (email, fullName, password) {
        var TeacherResource = $resource("teacher/create");
        var newTeacher = new TeacherResource({
          name: fullName,
          email: email,
          password: password
        });
        $modalInstance.close(newTeacher);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    //Leason Modal!
    $scope.ModalLeassonCtrl = function ($scope, $modal, $log) {

      $scope.alerts = []
      var teacherResource =  $resource('teacher/list');
      var teacherList = new teacherResource();

      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

      $scope.open = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'foo.html',
          controller: $scope.ModalLeassonInstance,
          size: size,
          resolve: {
            alerts: function() {
              return $scope.alerts;
            },
            teachers : function() {
              return teacherList.$get().then(function(result) {
                return result.teachers;
              });
            }
          }
        });

        modalInstance.result.then(function (newLesson) {
          newLesson.$save().then(function (result) {
            //clear the alerts
            $scope.alerts = [];
            if (result.error.id == 4 && result.error.name == "CreationFailed") {
              $scope.alerts.push({ msg: "To μάθημα υπαρχεί ήδη", type: 'danger'});
            } else if (result.error.id == -1 && result.auth.success) {
              $scope.alerts.push({msg : "Το μάθημα δημιουργήθηκε επιτυχώς", type: "success"});
            } else {
              $scope.alerts.push({msg : "Σφάλμα συστήματος " + result.error, type: "danger"});
            }
          }, function(error) {
            if (error.status == 401) {
              $location.path('/')
              //Unathorized attemp.Redirect to /home
            }
          });

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    };

    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    $scope.ModalLeassonInstance = function ($scope, $modalInstance, teachers) {
      $scope.teachers = teachers;
      $scope.ok = function (name, currentTeacher) {
        var lessonResource = $resource("lesson/create");
        var newLesson = new lessonResource({
          name: name,
          department: 1,
          teacher: currentTeacher.id,
          limit: 25
        });
        $modalInstance.close(newLesson);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };


  }]);
