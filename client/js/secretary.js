'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisSecretaryCtrl', ['$scope', '$routeParams', '$http', '$cookieStore', '$route', '$location', '$filter', 'GenerateFullName',
  function($scope, $routeParams, $http, $cookieStore, $route, $location, $filter, GenerateFullName) {

    $scope.navs = [
      { title: "Καθηγητές", visible: false, partial: "partials/secretary/_secretary_teacher.html"},
      { title: "Μαθήματα", visible : false, partial: "partials/secretary/_secretary_lesson.html"},
      { title: "Αίθουσες", visible : false, partial: "partials/secretary/_secretary_classroom.html"},
      { title: "Εργαστήρια", visible : false, partial: "partials/secretary/_secretary_lab.html"}
    ];

    $scope.teacherList = null;
    $scope.lessonList = null;
    $scope.classroomList = null;
    $scope.labList = null;
    $scope.gridData = null;
    $scope.fullName = GenerateFullName;

    $scope.gridPossibleOptions = {};
    $scope.gridPossibleOptions.gridTeacher = {
                                    data: $scope.teacherList,
                                    msgConfirm: 'τον καθηγητή',
                                    removeUrl: 'teacher/remove',
                                    type: 'teacherRemove',
                                    nameField: 'name',
                                    columnDefs: [
                                      { field: 'name', displayName: 'Όνοματεπώνυμο'},
                                      { field: 'email', displayName: 'Όνομα Χρήστη'},
                                      { field: 'id', cellTemplate: "partials/secretary/delete_button.html", displayName: 'Διαγραφή'}
                                    ]}

    $scope.gridPossibleOptions.gridLesson = {
                                    data: $scope.lessonList,
                                    msgConfirm: 'το μάθημα',
                                    removeUrl: 'lesson/remove',
                                    type: 'lessonRemove',
                                    nameField: 'name',
                                    columnDefs: [
                                      { field: 'name', displayName: 'Όνομα Μαθήματος'},
                                      { field: 'teachersName', displayName: 'Όνομα Καθηγητή'},
                                      { field: 'id', cellTemplate: "partials/secretary/delete_button.html", displayName: 'Διαγραφή'}
                                    ]}

    $scope.gridPossibleOptions.gridClassroom = {
                                    data: $scope.classroomList,
                                    msgConfirm: 'την αίθουσα',
                                    removeUrl: 'classroom/remove',
                                    type: 'classroomRemove',
                                    nameField: 'name',
                                    columnDefs: [
                                      { field: 'name', displayName: 'Όνομα Αίθουσας'},
                                      { field: 'id', cellTemplate: "partials/secretary/delete_button.html", displayName: 'Διαγραφή'}
                                    ]}

    $scope.gridPossibleOptions.gridLab = {
                                    data: $scope.labList,
                                    enableSorting: false,
                                    msgConfirm: 'τo εργαστήριο',
                                    removeUrl: 'lab/remove',
                                    type: 'labRemove',
                                    nameField: 'lessonname',
                                    columnDefs: [
                                      { field: 'classroomname', displayName: 'Όνομα Αίθουσας', width: 150},
                                      { field: 'lessonname', displayName: 'Όνομα Μαθήματος', width: 150},
                                      { field: 'teachername', displayName: 'Όνομα Καθηγητή', width: 150},
                                      { field: 'day', displayName: 'Ημέρα', width: 150},
                                      { field: 'timestart', displayName: 'Ώρα Έναρξης', width: 150},
                                      { field: 'timeend', displayName: 'Ώρα Λήξης', width:150},
                                      { field: 'recordspresence', displayName: 'Τύπος Εργαστηρίου', width: 200},
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
        case 'Καθηγητές' :
          $http.get('/teacher/list').
            success(function (result) {
              //We have not teachers at the moment
              if (result.teachers === null) {
                return;
              }

              $scope.teacherList = result.teachers;
              $scope.gridPossibleOptions.gridTeacher.data = $scope.teacherList;
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
              angular.forEach($scope.lessonList, function (lesson) {
                angular.forEach(lesson.teachers, function(teacher) {
                  if (lesson.teachersName === undefined) {
                    lesson.teachersName = teacher.name;
                  }
                  if ((lesson.teachersName.indexOf(teacher.name) == -1 && teacher.name !== undefined)) {
                    lesson.teachersName += teacher.name;
                  }
                });
              });

              $scope.gridPossibleOptions.gridLesson.data = $scope.lessonList;
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
              $scope.gridPossibleOptions.gridClassroom.data = $scope.classroomList;
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

              $scope.gridPossibleOptions.gridLab.data = $scope.labList;
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
            currentRow: function() {
              return $scope.currentRow;
            },
            currentGrid: function() {
              return $scope.currentGrid;
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
            case 'lesson':
              var departmentId = $cookieStore.get('departmentId');
              if (!departmentId) {
                $scope.alerts.push({msg: 'Σφάλμα συστήματος, δεν υπάρχουν τα σωστά cookies στο σύστημα σας', type: 'danger'});
                return;
              }

              var newLesson = {
                name: data.name,
                department: departmentId,
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
                teacher: data.teacher.id,
                lesson: data.lesson.id,
                classroom: data.classroom.id,
                day: data.day.id,
                starttime: data.starttime[0],
                endtime: data.endtime[0]
              };

              $http.post(data.url, newLab).
                success(function (result) {
                  //clear the alerts
                  $scope.alerts = [];
                  if (result.error.id == 4 && result.error.name == "CreationFailed") {
                    $scope.alerts.push({ msg: "Το εργαστήριο υπάρχει ήδη", type: 'danger'});
                  } else if (result.error.id == -1 && result.auth.success) {
                    $scope.alerts.push({msg : "Το εργαστήριο δημιουργήθηκε επιτυχώς", type: "success"});
                    //refresh our page
                    $scope.changeNav($scope.navs[3])
                  } else if (result.error.id == 10 && result.error.name == "ClassroomAlreadyUsed") {
                    $scope.alerts.push({ msg: "Η αίθουσα του εργαστηρίου χρησιμοποιείται από άλλο μάθημα.", type: 'danger'});
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
            case 'lessonRemove':
              var lesson = {
                lesson: data.row.entity.id
              }

              $http.post(data.url, lesson).
                success(function(result) {
                  if (result.error.id === -1 && result.auth.success) {
                    $scope.alerts.push({msg: 'Το μάθημα διαγράφτηκε επιτυχώς', type: 'success'});
                    $scope.changeNav($scope.navs[1]);
                  } else if (result.error.id === 8 && result.error.name === 'DeletionFailed') {
                    $scope.alerts.push({msg: 'Το μάθημα χρησιμοποιείται, δεν μπορείται να την διαγράψετε', type: 'danger'});
                  } else {
                    $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name, type: 'danger'});
                  }
                });
              break;
            case 'classroomRemove':
              var classroom = {
                classroom: data.row.entity.id
              }

              $http.post(data.url, classroom).
                success(function(result) {
                  if (result.error.id === -1 && result.auth.success) {
                    $scope.alerts.push({msg: 'Η αίθουσα διαγράφτηκε επιτυχώς', type: 'success'});
                    $scope.changeNav($scope.navs[2])
                  } else if (result.error.id === 8 && result.error.name === 'DeletionFailed') {
                    $scope.alerts.push({msg: 'Η αίθουσα χρησιμοποιείται, δεν μπορείται να την διαγράψετε', type: 'danger'});
                  } else {
                    $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name, type: 'danger'});
                  }
                });
              break;
            case 'labRemove':
              var lab = {
                lab: data.row.entity.labid
              }

              $http.post(data.url, lab).
                success(function(result) {
                  if (result.error.id === -1 && result.auth.success) {
                    $scope.alerts.push({msg: 'To εργαστήριο διαγράφτηκε επιτυχώς', type: 'success'});
                    $scope.changeNav($scope.navs[3])
                  } else if (result.error.id === 8 && result.error.name === 'DeletionFailed') {
                    $scope.alerts.push({msg: 'Το εργαστήριο χρησιμοποιείται, δεν μπορείται να την διαγράψετε', type: 'danger'});
                  } else {
                    $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name, type: 'danger'});
                  }
                });
              break;
            case 'teacherRemove':
              var teacher = {
                teacher: data.row.entity.id
              }

              $http.post(data.url, teacher).
                success(function(result) {
                  if (result.error.id === -1 && result.auth.success) {
                    $scope.alerts.push({msg: 'Ο καθηγητής διαγράφτηκε επιτυχώς', type: 'success'});
                  } else if (result.error.id === 8 && result.error.name === 'DeletionFailed') {
                    $scope.alerts.push({msg: 'Ο καθηγητής χρησιμοποιείται, δεν μπορείται να την διαγράψετε', type: 'danger'});
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

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance, teacherList, classroomList ,lessonList, currentRow, currentGrid) {
      $scope.teacherList = teacherList;
      $scope.lessonList = lessonList;
      $scope.classroomList = classroomList;
      $scope.teacherListCheckBox = teacherList;
      $scope.currentRow = currentRow;
      $scope.currentGrid = currentGrid;
      $scope.isTeacherSelected = false;
      //we need the current teacher in order to show only the lessons,
      //from the curren teacher, which has been selected above.
      $scope.findCurrentLessonsForTeacher = function(currentTeacher) {
        $scope.currentLessonList = $filter('filter')($scope.lessonList, function(lesson) {
          var showLesson = false;
          angular.forEach(lesson.teachers, function(teacher) {
            showLesson = (teacher.id == currentTeacher.id);
          });
          return showLesson;
        });
      }

      $scope.$watch(function() { return JSON.stringify([$scope.teacherListCheckBox]) }, function(value) {
       var isTeacherSelected = false;
       angular.forEach($scope.teacherListCheckBox, function(value) {
         if (value.ticked) {
           isTeacherSelected = value.ticked;
         }
       });

       $scope.isTeacherSelected = isTeacherSelected;
      });

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
