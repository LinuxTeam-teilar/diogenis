'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisStudentCtrl', ['$scope', '$routeParams', '$http', '$route', '$location', '$filter', '$cookieStore', 'GenerateFullName',
  function($scope, $routeParams, $http, $route, $location, $filter, $cookieStore, GenerateFullName) {

    $scope.navs = [
      { title: "Εργαστήρια", visible : false, partial: "partials/student/_student_lab.html"}
      //{ title: "Αίθουσες Αναμονής", visible : false, partial: "partials/student/_student_labinqueue.html"}
    ];

    $scope.teacherList = null;
    $scope.lessonList = null;
    $scope.classroomList = null;
    $scope.labList = null;
    $scope.labQueueList = null;
    $scope.allLabs = null;
    $scope.fullName = GenerateFullName;

    $scope.gridPossibleOptions = {};

    $scope.gridPossibleOptions.gridLab = {
                                    data: [],
                                    columnDefs: [
                                      { field: 'classroomname', displayName: 'Όνομα Αίθουσας', width: 150},
                                      { field: 'lessonname', displayName: 'Όνομα Μαθήματος', width: 150},
                                      { field: 'teachername', displayName: 'Όνομα Καθηγητή', width: 150},
                                      { field: 'day', displayName: 'Ημέρα', width: 100},
                                      { field: 'timestart', displayName: 'Ώρα Έναρξης', width: 120},
                                      { field: 'timeend', displayName: 'Ώρα Λήξης', width: 100},
                                      { field: 'recordspresence', displayName: 'Τύπος Εργαστηρίου', width: 180},
                                      { field: 'lablimit', displayName: 'Μέγεθος Εργαστηρίου', width: 180}
                                    ]}


    $scope.gridPossibleOptions.gridLabQueue = {
                                    data: [],
                                    rowHeight: 40,
                                    msgConfirm: 'τo εργαστήριο',
                                    removeUrl: 'student/remove/lab',
                                    type: 'labQueueRemove',
                                    columnDefs: [
                                      { field: 'classroomname', displayName: 'Όνομα Αίθουσας', width: 150},
                                      { field: 'lessonname', displayName: 'Όνομα Μαθήματος', width: 150},
                                      { field: 'teachername', displayName: 'Όνομα Καθηγητή', width: 150},
                                      { field: 'day', displayName: 'Ημέρα', width: 100},
                                      { field: 'timestart', displayName: 'Ώρα Έναρξης', width: 120},
                                      { field: 'timeend', displayName: 'Ώρα Λήξης', width: 100},
                                      { field: 'recordspresence', displayName: 'Τύπος Εργαστηρίου', width: 180},
                                      { field: 'lablimit', displayName: 'Μέγεθος Εργαστηρίου', width: 180},
                                      { field: 'id', cellTemplate: "partials/secretary/delete_button.html", displayName: 'Διαγραφή', width: 150}
                                    ]}

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
        case 'Εργαστήρια':

          $http.get('/lesson/list').
            success(function (result) {
              //We have not lessons at the moment
              if (result.lessons === null) {
                return;
              }

              $scope.lessonList = result.lessons
            });

          $http.get('/classroom/list').
            success(function (result) {
              //We have no classrooms at the moment
              if (result.classrooms.length === 0) {
                return;
              }
              $scope.classroomList = result.classrooms;
            });

          //get all the teachers
          $http.get('/teacher/list').
            success(function (result) {
              $scope.teacherList = result.teachers;
            });

          $http.get('/lab/list').
            success(function (result) {
            $scope.allLabs = result.labs;
          });

          $http.get('/student/list/labs').
            success(function (result) {
              //We have no classrooms at the moment
              if (result.student == undefined || result.student.labs == null || result.student.labs.length === 0) {
                return;
              }

              $scope.labList = result.student.labs
              angular.forEach($scope.labList, function(lab) {
                angular.forEach($scope.teacherList, function(teacher) {
                  if (lab.teacher == teacher.id) {
                    lab.teachername = teacher.name
                  }
                });
              });
              //Make the UI of the table more user friendly
              angular.forEach($scope.labList, function(value, key) {
                //we don't need the id here, but we keep it for convinience
                var days = [
                  {id: 1, name: "Δευτέρα"},
                  {id: 2, name: "Τρίτη"},
                  {id: 3, name: "Τετάρτη"},
                  {id: 4, name: "Πέμπτη"},
                  {id: 5, name: "Παρασκευή"}
                ]

                value.recordsCount = value.records[0]=== null ? 0 : value.records.length;
                if (value.recordspresence) {
                  $scope.gridPossibleOptions.gridLab.columnDefs.push({field: 'recordsCount', displayName: 'Παρουσίες', width: 120});
                  value.recordspresence = 'Καταμέτρηση Παρουσιών';
                } else {
                  $scope.gridPossibleOptions.gridLab.columnDefs.push({field: 'recordsCount',displayName:'Απουσίες', width: 120});
                  value.recordspresence = 'Καταμέτρηση Απουσιών';
                }

                if (value.day !== undefined) {
                  value.day = days[value.day -1].name
                }
              });

              angular.forEach($scope.teacherList, function(value, key) {
                if (value.id == $scope.labList.teacher) {
                  $scope.labList.teacherName = value.teachername;
                }
              });

              $scope.gridPossibleOptions.gridLab.data = $scope.labList;
            }).
            error(function (result, status) {
              if (status === 401) {
                //Unathorized
                $location.path('/')
              }
            })
          break;
        case 'Αίθουσες Αναμονής':

          $http.get('/lesson/list').
            success(function (result) {
              //We have not lessons at the moment
              if (result.lessons === null) {
                return;
              }

              $scope.lessonList = result.lessons
            });

          $http.get('/classroom/list').
            success(function (result) {
              //We have no classrooms at the moment
              if (result.classrooms.length === 0) {
                return;
              }
              $scope.classroomList = result.classrooms;
            });

          //get all the teachers
          $http.get('/teacher/list').
            success(function (result) {
              $scope.teacherList = result.teachers;
            });

          $http.get('/lab/list').
            success(function (result) {
            $scope.allLabs = result.labs;
          });

          $http.get('/student/list/labs').
            success(function (result) {
              //We have no classrooms at the moment
              if (result.student == undefined || result.student.labs == null || result.student.labs.length === 0) {
                return;
              }

              $scope.labQueueList = result.student.labs
              angular.forEach($scope.labQueueList, function(lab) {
                angular.forEach($scope.teacherList, function(teacher) {
                  if (lab.teacher == teacher.id) {
                    lab.teachername = teacher.name
                  }
                });
              });
              //Make the UI of the table more user friendly
              angular.forEach($scope.labQueueList, function(value, key) {
                //we don't need the id here, but we keep it for convinience
                var days = [
                  {id: 1, name: "Δευτέρα"},
                  {id: 2, name: "Τρίτη"},
                  {id: 3, name: "Τετάρτη"},
                  {id: 4, name: "Πέμπτη"},
                  {id: 5, name: "Παρασκευή"}
                ]

                value.recordsCount = value.records[0]=== null ? 0 : value.records.length;
                if (value.recordspresence) {
                  value.recordspresence = 'Καταμέτρηση Παρουσιών';
                } else {
                  value.recordspresence = 'Καταμέτρηση Απουσιών';
                }

                if (value.day !== undefined) {
                  value.day = days[value.day -1].name
                }
              });

              angular.forEach($scope.teacherList, function(value, key) {
                if (value.id == $scope.labList.teacher) {
                  $scope.labQueueList.teacherName = value.teachername;
                }
              });

              $scope.gridPossibleOptions.gridLabQueue.data = $scope.labQueueList;
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

    //student Modal
    $scope.ModalDemoCtrl = function ($scope, $modal, $route) {

      $scope.alerts = []
      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };

      $scope.gridActions = {
        removeEntity: function(row, grid) {
          $scope.currentRow = row;
          $scope.currentGrid = grid;
          $scope.open('partials/modals/delete_modal.html');
        }
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
            },
            lessonList: function() {
              return $scope.lessonList;
            },
            classroomList: function() {
              return $scope.classroomList;
            },
            labList: function() {
              return $scope.labList;
            },
            allLabs: function() {
              return $scope.allLabs;
            },
            currentRow: function() {
              return $scope.currentRow;
            },
            currentGrid: function() {
              return $scope.currentGrid;
            },
          }
        });

        modalInstance.result.then(function (data) {
          switch (data.type) {
            case 'registerLab':
              // We must match the result from the html form
              // with the correct entry from our model.
              // Unfortunatly the form returns only the visual data
              // so we are ending up with losing stuff like teacher.id and in general
              // everything that we don't show in the UI.

              var newLab = {};

              angular.forEach($scope.allLabs, function(lab) {
                if (data.classroom.id == lab.classroomid && data.teacher.id == lab.teacherid
                   && data.lesson.id == lab.lessonid && data.day.id == lab.day
                   && data.currentTimeLab == (lab.timestart + " - " + lab.timeend)) {
                     newLab["labId"] = lab.labid;
                     newLab["studentId"] = $cookieStore.get('id');
                   }
              });

              $http.post(data.url, newLab).
                success(function (result) {
                  //clear the alerts
                  $scope.alerts = [];
                  if (result.error.id == 4 && result.error.name == "CreationFailed") {
                    $scope.alerts.push({ msg: "Το εργαστήριο υπάρχει ήδη", type: 'danger'});
                  } else if (result.error.id == -1 && result.auth.success) {
                    $scope.alerts.push({msg : "Η εγγραφή ολοκληρώθηκε επιτυχώς", type: "success"});
                    //refresh our page
                    $scope.changeNav($scope.navs[0])
                  } else if (result.error.id === 5 && result.error.name === 'UpdateFailed') {
                    $scope.alerts.push({msg: 'Έχετε ήδη γραφτεί σε αυτό το εργαστήριο', type: 'info'});
                  } else {
                    $scope.alerts.push({msg : "Σφάλμα συστήματος " + result.error.name, type: "danger"});
                  }
                }).
                error(function (result, status) {
                  if (status === 401) {
                    //Unathorized
                    $location.path('/')
                  }
                })
              break;
            case 'labQueueRemove':
              var lab = {
                lab: data.row.entity.id
              }

              $http.post(data.url, lab).
                success(function(result) {
                  if (result.error.id === -1 && result.error.auth.success) {
                    $scope.alerts.push({msg: 'To εργαστήριο διαγράφτηκε επιτυχώς', type: 'success'});
                  } else {
                    $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name, type: 'danger'});
                  }
                });
              break;

          }
        }, function () {
        });
      };
    };

    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance, teacherList, classroomList ,lessonList, labList, allLabs, currentRow, currentGrid) {
      $scope.labList = labList;
      $scope.teacherList = teacherList;
      $scope.lessonList = lessonList;
      $scope.classroomList = classroomList;
      $scope.teacherListCheckBox = teacherList;
      $scope.allLabs = allLabs;
      $scope.currentRow = currentRow;
      $scope.currentGrid = currentGrid;
      $scope.days = [
        {id: 1, name: "Δευτέρα"},
        {id: 2, name: "Τρίτη"},
        {id: 3, name: "Τετάρτη"},
        {id: 4, name: "Πέμπτη"},
        {id: 5, name: "Παρασκευή"}
      ]

      $scope.timeStart = [];
      for (var i=8; i<=20; i++) {
        $scope.timeStart.push([i])
      }

      //$scope.timeEnd = [];
      //for (var i=1; i<=60; i++) {
      //  $scope.timeEnd.push([i])
      //}

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
