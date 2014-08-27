'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisSecretaryCtrl', ['$scope', '$routeParams', '$http', '$route', '$location',
  function($scope, $routeParams, $http, $route, $location) {

    $scope.navs = [
      { title: "Καθηγητές", visible: false, partial: "partials/_secretary_teacher.html"},
      { title: "Μαθήματα", visible : false, partial: "partials/_secretary_lesson.html"},
      { title: "Αίθουσες", visible : false, partial: "partials/_secretary_classroom.html"},
      { title: "Εργαστήρια", visible : false, partial: "partials/_secretary_lab.html"}
    ];

    $scope.teacherList = null;
    $scope.lessonList = null;
    $scope.classroomList = null;
    $scope.labList = null;
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

    gridPossibleOptions.gridClassroom = {
                                    data: 'classroomList',
                                    columnDefs: [
                                      { field: 'name', displayName: 'Όνομα Αίθουσας'}
                                    ]}

    gridPossibleOptions.gridLab = {
                                    data: 'labList',
                                    columnDefs: [
                                      { field: 'classroomname', displayName: 'Όνομα Αίθουσας'},
                                      { field: 'lessonname', displayName: 'Όνομα Μαθήματος'},
                                      { field: 'classroomname', displayName: 'Όνομα Καθηγητή'},
                                      { field: 'day', displayName: 'Ημέρα'},
                                      { field: 'timestart', displayName: 'Ώρα Έναρξης'},
                                      { field: 'timeend', displayName: 'Ώρα Λήξης'},
                                      { field: 'recordspresence', displayName: 'Τύπος Εργαστηρίου'}
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
              $scope.lessonList = result.lessons;
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

        case 'Αίθουσες':
          $http.get('/classroom/list').
            success(function (result) {
              //We have no classrooms at the moment
              if (result.classrooms.length === 0) {
                return;
              }
              $scope.classroomList = result.classrooms;
              $scope.selectedOpts = null;
              $scope.selectedOpts = gridPossibleOptions.gridClassroom;
              $scope.selectedOpts.data = $scope.classroomList;
            }).
            error(function (result, status) {
              if (status === 401) {
                //Unathorized
                $location.path('/')
              }
            })
          break;
        case 'Εργαστήρια':
          //update our data
          loadTableAsset($scope.navs[0])
          loadTableAsset($scope.navs[1])
          loadTableAsset($scope.navs[2])

          $http.get('/lab/list').
            success(function (result) {
              //We have no classrooms at the moment
              if (result.labs.length === 0) {
                return;
              }
              $scope.labList = result.labs;
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
            },
            lessonList: function() {
              return $scope.lessonList;
            },
            classroomList: function() {
              return $scope.classroomList;
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
                    $scope.alerts.push({ msg: "Ο καθητής υπάρχει ήδη", type: 'danger'});
                  } else if (result.error.id == -1 && result.auth.success) {
                    $scope.alerts.push({msg : "Ο καθηγητής δημιουργήθηκε επιτυχώς", type: "success"});
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
                    $scope.alerts.push({ msg: "To μάθημα υπάρχει ήδη", type: 'danger'});
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
                            //refresh our page
                            $scope.changeNav($scope.navs[1])
                          })
                      }
                    });
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

            case 'classroom':
              var newClassroom =
              {
                name: data.name
              };

              $http.post(data.url, newClassroom).
                success(function (result) {
                  //clear the alerts
                  $scope.alerts = [];
                  if (result.error.id == 4 && result.error.name == "CreationFailed") {
                    $scope.alerts.push({ msg: "Η αίθουσα υπάρχει ήδη", type: 'danger'});
                  } else if (result.error.id == -1 && result.auth.success) {
                    $scope.alerts.push({msg : "Η αίθουσα δημιουργήθηκε επιτυχώς", type: "success"});
                    //refresh our page
                    $scope.changeNav($scope.navs[2])
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
            case 'lab':
              // We must match the result from the html form
              // with the correct entry from our model.
              // Unfortunatly the form returns only the visual data
              // so we are ending up with losing stuff like teacher.id and in general
              // everything that we don't show in the UI.
              var newLab =
              {
                recordspresence: data.recordspresence,
                limit: data.limit,
                starttime: data.starttime,
                endtime: data.endtime
              };
              angular.forEach(data.teacherList, function(value, key) {
                if (value.name = data.teacher) {
                  newLab["teacher"] = value.id
                }
              })

              angular.forEach(data.lessonList, function(value, key) {
                if (value.name = data.lesson) {
                  newLab["lesson"] = value.id
                }
              })

              angular.forEach(data.classroomList, function(value, key) {
                if (value.name = data.classroom) {
                  newLab["classroom"] = value.id
                }
              })
              angular.forEach(data.dayList, function(value, key) {
                if (value.name = data.day) {
                  newLab["day"] = value.id
                }
              })

              $http.post(data.url, newLab).
                success(function (result) {
                  //clear the alerts
                  $scope.alerts = [];
                  if (result.error.id == 4 && result.error.name == "CreationFailed") {
                    $scope.alerts.push({ msg: "Το εργαστήριο υπάρχει ήδη", type: 'danger'});
                  } else if (result.error.id == -1 && result.auth.success) {
                    $scope.alerts.push({msg : "Το εργαστήριο δημιουργήθηκε επιτυχώς", type: "success"});
                    //refresh our page
                    $scope.changeNav($scope.navs[2])
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

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance, teacherList, classroomList ,lessonList) {
      $scope.teacherList = teacherList;
      $scope.lessonList = lessonList;
      $scope.classroomList = classroomList;
      $scope.teacherListCheckBox = teacherList;
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
