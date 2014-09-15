'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisStudentCtrl', ['$scope', '$routeParams', '$http', '$route', '$location', '$filter', '$cookieStore', 'GenerateFullName',
  function($scope, $routeParams, $http, $route, $location, $filter, $cookieStore, GenerateFullName) {

    $scope.navs = [
      { title: "Εργαστήρια", visible : false, partial: "partials/student/_student_lab.html"},
      //{ title: "Δήλωση Εργαστηρίου", visible : false, partial: "partials/teacher/_teacher_classroom.html"}
    ];

    $scope.teacherList = null;
    $scope.lessonList = null;
    $scope.classroomList = null;
    $scope.labList = null;
    $scope.allLabs = null;
    $scope.gridData = null;
    $scope.fullName = GenerateFullName;

    var gridPossibleOptions = {};
    $scope.selectedOpts = {};
    $scope.selectedOpts.data = $scope.labList

    gridPossibleOptions.gridLab = {
                                    data: 'labList',
                                    columnDefs: [
                                      { field: 'classroomname', displayName: 'Όνομα Αίθουσας'},
                                      { field: 'lessonname', displayName: 'Όνομα Μαθήματος'},
                                      { field: 'teachername', displayName: 'Όνομα Καθηγητή'},
                                      { field: 'day', displayName: 'Ημέρα'},
                                      { field: 'timestart', displayName: 'Ώρα Έναρξης'},
                                      { field: 'timeend', displayName: 'Ώρα Λήξης'},
                                      { field: 'recordspresence', displayName: 'Τύπος Εργαστηρίου'},
                                      { field: 'lablimit', displayName: 'Μέγεθος Εργαστηρίου'}
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
                value.recordspresence = value.recordspresence? 'Καταμέτρηση Παρουσιών' : 'Καταμέτρηση Απουσιών';
                if (value.day !== undefined) {
                  value.day = days[value.day -1].name
                }
              });

              angular.forEach($scope.teacherList, function(value, key) {
                if (value.id == $scope.labList.teacher) {
                  $scope.labList.teacherName = value.teachername;
                }
              });
              $scope.selectedOpts = null;
              $scope.selectedOpts = gridPossibleOptions.gridLab;
              $scope.selectedOpts.data = $scope.labList;
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
            }
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

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance, teacherList, classroomList ,lessonList, labList, allLabs) {
      $scope.labList = labList;
      $scope.teacherList = teacherList;
      $scope.lessonList = lessonList;
      $scope.classroomList = classroomList;
      $scope.teacherListCheckBox = teacherList;
      $scope.allLabs = allLabs;
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
