'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisTeacherCtrl', ['$scope', '$routeParams', '$http', '$route', '$location', '$filter', '$cookieStore', 'GenerateFullName',
  function($scope, $routeParams, $http, $route, $location, $filter, $cookieStore, GenerateFullName) {

    $scope.navs = [
      { title: "Μαθήματα", visible : false, partial: "partials/teacher/_teacher_lesson.html"},
      { title: "Αίθουσες", visible : false, partial: "partials/teacher/_teacher_classroom.html"},
      { title: "Εργαστήρια", visible : false, partial: "partials/teacher/_teacher_lab.html"}
    ];

    $scope.teacherList = null;
    $scope.lessonList = null;
    $scope.classroomList = null;
    $scope.labList = null;
    $scope.fullName = GenerateFullName;

    $scope.gridPossibleOptions = {};

    $scope.gridPossibleOptions.gridLesson = {
                                    data: [],
                                    columnDefs: [
                                      { field: 'name', displayName: 'Όνομα Μαθήματος'},
                                      { field: 'teachersName', displayName: 'Όνομα Καθηγητή'}
                                    ]}

    $scope.gridPossibleOptions.gridClassroom = {
                                    data: [],
                                    columnDefs: [
                                      { field: 'name', displayName: 'Όνομα Αίθουσας'}
                                    ]}

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
        case 'Μαθήματα':
          $http.get('/lesson/list').
            success(function (result) {
              //We have not teachers at the moment
              if (result.lessons === null) {
                return;
              }

              var currentTeacherId = $cookieStore.get('id');
              $scope.lessonList = $filter('filter')(result.lessons, function(item) {
                var showLesson = false;
                angular.forEach(item.teachers, function(value) {
                  showLesson = (value.id == currentTeacherId);
                })
                return showLesson;
              });

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

          //get all the teachers
          $http.get('/teacher/list').
            success(function (result) {
              $scope.teacherList = result.teachers;
            })

          $http.get('/lab/list').
            success(function (result) {
              //We have no classrooms at the moment
              if (result.labs.length === 0) {
                return;
              }

              //return only the labs from the current teacher
              var currentTeacherId = $cookieStore.get('id');
              $scope.labList = $filter('filter')(result.labs, {teacherid: currentTeacherId});
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
                  } else if (result.error.id == 10 && result.error.name == "ClassroomAlreadyUsed") {
                    $scope.alerts.push({ msg: "Η αίθουσα του εργαστηρίου χρησιμοποιείται από άλλο μάθημα.", type: 'danger'});
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
                teacher: data.teacher.id,
                lesson: data.lesson.id,
                classroom: data.classroom.id,
                day: data.day.id,
                recordspresence: data.recordspresence,
                limit: data.limit,
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
                    $scope.changeNav($scope.navs[2]);
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
