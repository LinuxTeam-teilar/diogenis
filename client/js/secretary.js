'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisSecretaryCtrl', ['$scope', '$routeParams', '$http', '$route', '$location',
  function($scope, $routeParams, $http, $route, $location) {

    $scope.navs = [
      { title: "Καθηγητές", visible: false, partial: "partials/_secretary_teacher.html"},
      { title: "Μαθήματα", visible : false, partial: "partials/_secretary_leasson.html"}
    ];

    $scope.teacherList = null;
    $scope.lessonList = null;
    $scope.gridData = null;

    var gridPossibleOptions = {};
    $scope.selectedOpts = {};
    $scope.selectedOpts.data = $scope.teacherList

    gridPossibleOptions.gridTeacher = {
                                    data: 'teacherList',
                                    columnDefs: [
                                      { field: 'name', displayName: 'Όνοματεπώνυμο'},
                                      { field: 'email', displayName: 'Όνομα Χρήστη'}
                                    ]}

    gridPossibleOptions.gridLesson = {
                                    data: 'lessonList',
                                    columnDefs: [
                                      { field: 'name', displayName: 'Όνομα Μαθήματος'}
                                    ]}

    $scope.gridOptions = { data: 'selectedOpts.data',
                           columnDefs: 'selectedOpts.columnDefs'
    }

    $scope.changeNav = function(item) {
      if (item.visible) {
        loadTableAsset(item);
        //don't disable the current nav
        return;
      } else {
        angular.forEach($scope.navs, function(value, key) {
          //disable the current nav
          if (value.visible) {
            value.visible = false;
          }

          item.visible = true;
          loadTableAsset(item);
        });
      }
    };


    var loadTableAsset = function(item) {
      switch (item.title) {
        case 'Καθηγητές' :
          $http.get('/teacher/list').
            success(function (result) {
              //We have not teachers at the moment
              if (result.teachers === null) {
                return;
              }
              $scope.teacherList = result.teachers;
              $scope.selectedOpts = gridPossibleOptions.gridTeacher;
              $scope.selectedOpts.data = $scope.teacherList;
            }).
            error(function (result, status) {
              if (status === 401) {
                //Unathorized
                $location.path('/')
              }
            })
          break;
        case 'Μαθήματα':
          $http.get('/lesson/list').
            success(function (result) {
              //We have not teachers at the moment
              if (result.lessons === null) {
                return;
              }
              $scope.lessonList = result.lesson;
              $scope.selectedOpts = null;
              $scope.selectedOpts = gridPossibleOptions.gridLesson;
              $scope.selectedOpts.data = $scope.lessonList;
            }).
            error(function (result, status) {
              if (status === 401) {
                //Unathorized
                $location.path('/')
              }
            })
          break;
      }
    }

    //Teacher Modal
    $scope.ModalDemoCtrl = function ($scope, $modal, $route) {

      $scope.alerts = []
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

      $scope.open = function (templateUrl) {
        var modalInstance = $modal.open({
          templateUrl: templateUrl,
          controller: $scope.ModalInstanceCtrl,
          size: 'lg',
          resolve: {
            alerts: function() {
              return $scope.alerts;
            },
            teacherList: function() {
              return $scope.teacherList;
            }
          }
        });

        modalInstance.result.then(function (data) {
          switch (data.type) {
            case 'teacher':
              var newTeacher =
              {
                name: data.fullName,
                email: data.email,
                password: data.password
              };

              $http.post(data.url, newTeacher).
                success(function (result) {
                  //clear the alerts
                  $scope.alerts = [];

                  if (result.error.id == 4 && result.error.name == "CreationFailed") {
                    $scope.alerts.push({ msg: "Ο καθητής υπαρχεί ήδη", type: 'danger'});
                  } else if (result.error.id == -1 && result.auth.success) {
                    $scope.alerts.push({msg : "Ο καθητής δημιουργήθηκε επιτυχώς", type: "success"});
                    //refresh our page
                  } else {
                    $scope.alerts.push({msg : "Σφάλμα συστήματος " + result.error, type: "danger"});
                  }
                }).
                error(function (result, status) {
                  if (status === 401) {
                    //Unathorized
                    $location.path('/')
                  }
                })
              break;
            case 'lesson':
              var newLesson = {
                name: data.name,
                department: 1,
              };

              var currentTeachers;

              $http.post(data.url, newLesson).
                success(function (result) {
                  //clear the alerts
                  $scope.alerts = [];
                  if (result.error.id == 4 && result.error.name == "CreationFailed") {
                    $scope.alerts.push({ msg: "To μάθημα υπαρχεί ήδη", type: 'danger'});
                  } else if (result.error.id == -1 && result.auth.success) {
                    $scope.alerts.push({msg : "Το μάθημα δημιουργήθηκε επιτυχώς", type: "success"});
                    angular.forEach(data.teacherListCheckBox, function(value, key) {
                      if (value.ticked) {
                        var assignTeacher = {
                          lesson: result.lesson.id,
                          teacher: value.id
                        }

                        $http.post('lesson/add/teacher', assignTeacher).
                          success(function (resultNested) {
                            if (resultNested.error.id ==-1 && resultNested.lesson.teacher) {
                              $scope.alerts.push({msg : "Ο Καθηγητής " + value.name + " προστέθηκε επιτυχώς στο μάθημα", type: "success"});
                            }
                          })
                      }
                    });
                    //refresh our page
                    //$route.reload();
                  } else {
                    $scope.alerts.push({msg : "Σφάλμα συστήματος " + result.error, type: "danger"});
                  }
                }).
                error(function (result, status) {
                  if (status === 401) {
                    //Unathorized
                    $location.path('/')
                  }
                })
              break;

          }
        }, function () {
        });
      };
    };

    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance, teacherList) {
      $scope.teacherListCheckBox = teacherList;
      angular.forEach($scope.teacherListCheckBox, function(value, key) {
        value["ticked"] = false;
      });

      $scope.ok = function (data) {
        $modalInstance.close(data);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

  }]);
