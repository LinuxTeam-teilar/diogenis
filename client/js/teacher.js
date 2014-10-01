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

diogenisControllers.controller('DiogenisTeacherCtrl', ['$scope', '$routeParams', '$http', '$route', '$location', '$filter', '$cookieStore', 'GenerateFullName',
  function($scope, $routeParams, $http, $route, $location, $filter, $cookieStore, GenerateFullName) {

    $scope.navs = [
      { title: "Μαθήματα", visible : false, partial: "partials/teacher/_teacher_lesson.html"},
      { title: "Αίθουσες", visible : false, partial: "partials/teacher/_teacher_classroom.html"},
      { title: "Εργαστήρια", visible : false, partial: "partials/teacher/_teacher_lab.html"},
      { title: "Τμήματα", visible : false, partial: "partials/teacher/_teacher_lab_student.html"}
     // { title: "Αίθουσα Αναμονής", visible : false, partial: "partials/teacher/_teacher_lab_queue.html"}
    ];

    $scope.teacherList = null;
    $scope.lessonList = null;
    $scope.classroomList = null;
    $scope.labList = null;
    $scope.fullName = GenerateFullName;

    $scope.gridPossibleOptions = {};
    $scope.gridTmimata = [];
    $scope.showBusyIdicator = true;
    $scope.alerts = []

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.teacherUtils = {
      beginMoveStudents: function(grid, oldLab, newLab) {
        angular.forEach(grid.options.data, function(student) {
          if (student.checked) {
            $scope.teacherUtils.moveStudent(student.id, oldLab, newLab);
          }
        });

      },
      moveStudent: function(studentId, oldLab, newLab) {
      //oldLab and newLab should be reversed,
      //otherwise we are providing wrong data to the server
      var moveData = {
        student: studentId,
        oldLab: newLab.labid,
        newLab: oldLab.id
      }

      $http.post('student/move', moveData).
        success(function(result) {
          if (result.error.id == -1 && result.operation.success) {
            $scope.alerts.push({msg: 'Ο φοιτητής μετακινήθηκε στο τμήμα ' + newLab.fullName + ' από το τμήμα ' + oldLab.fullName, type:'success'});
          } else {
            $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name});
          }
        });
      },

      findLabId: function(lab, days) {
        var labId = $filter('filter')($scope.labList, function(item) {
          return item.lessonid === lab.lesson && item.timestart === lab.timestart
          && item.timeend === lab.timeend && days[lab.day - 1].name === item.day;
        });

        //serialise the labId
        labId = labId[0].labid;
        return labId;
      },

      findAvailableLabs: function(currentTeacherLabs, currentLab) {
        var candidates = [];
        //optimize the loop iteration
        var indexer = [];

        var days = [
          {id: 1, name: "Δευτέρα"},
          {id: 2, name: "Τρίτη"},
          {id: 3, name: "Τετάρτη"},
          {id: 4, name: "Πέμπτη"},
          {id: 5, name: "Παρασκευή"}
        ]

        var currentLabId = $scope.teacherUtils.findLabId(currentLab, days);
        angular.forEach(currentTeacherLabs, function(lab) {
          if (lab.lessonname == currentLab.lessonname && indexer.indexOf(lab) < 0) {
            //var labId = $scope.teacherUtils.findLabId(lab, days);
            //we shouldn't list the lab itself. We cannot move
            //a student to the same lab.
            if (lab.labid !== currentLabId) {
              lab.labId = lab.labid;
              currentLab.labId = currentLabId;
              lab.fullName = lab.lessonname + " " + lab.classroomname + " " + lab.day + " " + lab.timestart + " - " + lab.timeend
              currentLab.fullName = currentLab.lessonname + " " + currentLab.classroomname + " " + days[currentLab.day-1].name + " " + currentLab.timestart + " - " + currentLab.timeend
              var moveLab = {
                oldLab: currentLab,
                newLab: lab
              }

              candidates.push(moveLab);
              indexer.push(lab);
            }
          }
        });
        return candidates;
      },
      findAvailableLabsforQueue: function(currentTeacherLabs, currentLab) {
        var candidates = [];
        //optimize the loop iteration
        var indexer = [];

        var days = [
          {id: 1, name: "Δευτέρα"},
          {id: 2, name: "Τρίτη"},
          {id: 3, name: "Τετάρτη"},
          {id: 4, name: "Πέμπτη"},
          {id: 5, name: "Παρασκευή"}
        ]

        var currentLabId = $scope.teacherUtils.findLabId(currentLab, days);
        angular.forEach(currentTeacherLabs, function(lab) {
          if (lab.lessonname == currentLab.lessonname && indexer.indexOf(lab) < 0) {
            //var labId = $scope.teacherUtils.findLabId(lab, days);
            //we shouldn't list the lab itself. We cannot move
            //a student to the same lab.
            var labId = $scope.teacherUtils.findLabId(lab, days);
            lab.labId = labId;
            currentLab.labId = currentLabId;
            lab.fullName = lab.lessonname + " " + lab.classroomname + " " + days[lab.day-1].name + " " + lab.timestart + " - " + lab.timeend
            currentLab.fullName = currentLab.lessonname + " " + currentLab.classroomname + " " + days[currentLab.day-1].name + " " + currentLab.timestart + " - " + currentLab.timeend
            var moveLab = {
              oldLab: currentLab,
              newLab: lab
            }

            candidates.push(moveLab);
            indexer.push(lab);
          }
        });
        return candidates;
      }
    }

    $scope.gridActions = {
      addStudentRecord: function(row, grid) {
        var newRecordEntry = {
          labId: grid.options.labId,
          studentId: row.entity.id
        }

        console.log(newRecordEntry)
        $http.post('student/add/record', newRecordEntry).
          success(function(result) {
            if (result.error.id == -1 && result.studentRecord) {
              var choiceMsg = grid.options.recordspresence ? "Παρουσία" : 'Απουσία';
              $scope.alerts = [];

              $scope.alerts.push({msg: 'Προστέθηκε ' + choiceMsg + ' στον φοιτητή ' + row.entity.name, type: 'success' });
              row.entity.recordsCount++;
            } else {
              $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name, type: 'danger'});
            }
          });
      },
      removeStudentRecord: function(row, grid) {
        var newRecordEntry = {
          labId: grid.options.labId,
          studentId: row.entity.id
        }

        $http.post('student/remove/record', newRecordEntry).
          success(function(result) {
            if (result.error.id == -1 && result.studentRecord) {
              var choiceMsg = grid.options.recordspresence ? "Παρουσία" : 'Απουσία';
              $scope.alerts = [];

              $scope.alerts.push({msg: 'Αφαιρέθηκε ' + choiceMsg + ' στον φοιτητή ' + row.entity.name, type: 'success' });
              row.entity.recordsCount--;
            } else {
              $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name, type: 'danger'});
            }
          });
      },

      toggleLaptop: function(row, grid) {
        var newRecordEntry = {
          labId: grid.options.labId,
          studentId: row.entity.id
        }

        var url = row.entity.haslaptop ? 'lab/remove/laptop' : 'lab/add/laptop';
        $http.post(url, newRecordEntry).
          success(function(result) {
            if (result.error.id == -1 && result.operation.success) {
              var choiceMsg = row.entity.haslaptop ? "Αφαιρέθηκε" : 'Προστέθηκε';
              $scope.alerts = [];

              $scope.alerts.push({msg: choiceMsg + ' το laptop στον φοιτητή ' + row.entity.name, type: 'success' });
              row.entity.haslaptop = !row.entity.haslaptop;
            } else {
              $scope.alerts.push({msg: 'Σφάλμα συστήματος ' + result.error.name, type: 'danger'});
            }
          });
      },



    }

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
                                    msgConfirm: 'τo εργαστήριο',
                                    removeUrl: 'lab/remove',
                                    type: 'labRemove',
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

    $scope.gridPossibleOptions.gridLabStudent = {
                                    data: [],
                                    columnDefs: [
                                      { field: 'checked', displayName: 'A/A', cellTemplate: 'partials/teacher/checkbox.html', width: 70},
                                      { field: 'name', displayName: 'Ονοματεπώνυμο', width: 150},
                                      { field: 'identity', displayName: 'AM', width: 100},
                                      { field: 'isstudentinqueuelabel', displayName: 'Αίθουσα Αναμονής', width: 150}
                                      // records should be created dynamicly
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
        case "Τμήματα":
          loadTableAsset($scope.navs[2]);
                var days = [
                  {id: 1, name: "Δευτέρα"},
                  {id: 2, name: "Τρίτη"},
                  {id: 3, name: "Τετάρτη"},
                  {id: 4, name: "Πέμπτη"},
                  {id: 5, name: "Παρασκευή"}
                ]
          $http.get('teacher/list/students').
            success(function(result) {
              if (result.teacher.labs === null) {
                return;
              }

              var teacherId = result.teacher.id;
              var currentTeacherLabs = $filter('filter')(result.teacher.labs, function (item) {
                return item.teacher === teacherId;
              });

              $scope.gridTmimata = []
              angular.forEach(currentTeacherLabs, function(lab, key) {
                angular.forEach(lab.students, function(student) {
                  student.recordsCount = student.records[0]=== null ? 0 : student.records.length;
                  student.lablimit = lab.lablimit;
                  student.checked = false;
                  student.isstudentinqueuelabel = student.isstudentinqueue ? 'NAI' : 'OXI';
                });
                var labId = $filter('filter')($scope.labList, function(item) {
                  return item.lessonid === lab.lesson;
                });

                var candidateLabs = $scope.teacherUtils.findAvailableLabs($scope.labList, lab);

                var grid = {
                  data: lab.students,
                  recordspresence: lab.recordspresence,
                  rowHeight: 40,
                  labId: lab.labId,
                  candidatesForMove: candidateLabs,
                  beginMoveStudents: function(grid, oldLab, newLab) { $scope.teacherUtils.beginMoveStudents(grid, oldLab, newLab)},
                  headerTemplate: "partials/teacher/header_tmimata.html",
                  columnDefs: $scope.gridPossibleOptions.gridLabStudent.columnDefs,
                  lesson: lab.lessonname,
                  classroom: lab.classroomame,
                  day: days[lab.day-1].name + " " + lab.timestart + " - " + lab.timeend
                }


                if (lab.recordspresence) {
                  grid.columnDefs.push({field: 'recordsCount', cellTemplate: "partials/teacher/records_buttons.html", displayName: 'Παρουσίες', width: 120},
                                       {field: 'lablimit', displayName: 'Μέγεθος Εργαστηρίου', width: 180}
                                      );
                } else {
                  grid.columnDefs.push({field: 'recordsCount', cellTemplate: "partials/teacher/records_buttons.html", displayName: 'Απουσίες', width: 120},
                                       {field: 'lablimit', displayName: 'Μέγεθος Εργαστηρίου', width: 180}
                                      );
                }

                grid.columnDefs.push({field: 'haslaptop', cellTemplate: 'partials/teacher/laptop_button.html', displayName: 'Έχει Laptop', width:120});

                if ($scope.gridTmimata.indexOf(grid) == -1) {
                  $scope.gridTmimata.push(grid);
                }
                $scope.showBusyIdicator = false;
              });
            }).
            error(function (result, status) {
              if (status === 401) {
                //Unathorized
                $location.path('/')
              }
            });
          break;
          case "Αίθουσα Αναμονής":
          loadTableAsset($scope.navs[2]);
          $scope.gridTmimata = [];

          var days = [
            {id: 1, name: "Δευτέρα"},
            {id: 2, name: "Τρίτη"},
            {id: 3, name: "Τετάρτη"},
            {id: 4, name: "Πέμπτη"},
            {id: 5, name: "Παρασκευή"}
          ]

          $http.get('teacher/list/students').
            success(function(result) {
              if (result.teacher.labs !== null) {
                $scope.normalLabs = result.teacher.labs;
              }
            });

          $http.get('teacher/list/students').
            success(function(result) {
              if (result.teacher.labs === null) {
                return;
              }

              var teacherId = result.teacher.id;
              var currentTeacherLabs = $filter('filter')(result.teacher.labs, function (item) {
                return item.teacher === teacherId;
              });

              $scope.gridTmimata = []
              angular.forEach(currentTeacherLabs, function(lab) {
                angular.forEach(lab.students, function(student) {
                  student.lablimit = lab.lablimit;
                  student.checked = false;
                });
                var labId = $filter('filter')($scope.labList, function(item) {
                  return item.lessonid === lab.lesson;
                });

                var candidateLabs = $scope.teacherUtils.findAvailableLabsforQueue($scope.normalLabs, lab);

                //serialise the labId
                console.log("fooooooooooo")
                console.log(labId)
                labId = labId[0].labid;
                var grid = {
                  data: lab.students,
                  recordspresence: lab.recordspresence,
                  rowHeight: 40,
                  labId: labId,
                  candidatesForMove: candidateLabs,
                  beginMoveStudents: function(grid, oldLab, newLab) { $scope.teacherUtils.beginMoveStudents(grid, oldLab, newLab)},
                  headerTemplate: "partials/teacher/header_tmimata.html",
                  columnDefs: $scope.gridPossibleOptions.gridLabStudent.columnDefs,
                  lesson: lab.lessonname,
                  classroom: lab.classroomame,
                  day: days[lab.day-1].name + " " + lab.timestart + " - " + lab.timeend
                }

                if ($scope.gridTmimata.indexOf(grid) == -1) {
                  $scope.gridTmimata.push(grid);
                }
                $scope.showBusyIdicator = false;
              });
            }).
            error(function (result, status) {
              if (status === 401) {
                //Unathorized
                $location.path('/')
              }
            });
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
            },
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
            case 'labRemove':
              var lab = {
                lab: data.row.entity.labid
              }

              $http.post(data.url, lab).
                success(function(result) {
                  if (result.error.id === -1 && result.error.auth.success) {
                    $scope.alerts.push({msg: 'To εργαστήριο διαγράφτηκε επιτυχώς', type: 'success'});
                  } else if (result.error.id === 8 && result.error.name === 'DeletionFailed') {
                    $scope.alerts.push({msg: 'Το εργαστήριο χρησιμοποιείται, δεν μπορείται να την διαγράψετε', type: 'danger'});
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

