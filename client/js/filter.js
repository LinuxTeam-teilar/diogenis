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

/* Filters */

diogenisApp.filter('gt', function () {
    return function ( items, value ) {
        var filteredItems = []
        angular.forEach(items, function ( item ) {
            if ( item > value ) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    }
});

//Find the correct lesson based on the current teacher
diogenisApp.filter('lessonFilter', function () {
    return function ( items, currentTeacher ) {
        var filteredItems = []
        if (currentTeacher === undefined) {
          return filteredItems;
        }
        angular.forEach(items, function ( lesson ) {
          angular.forEach(lesson.teachers, function (teacher) {
            if (teacher.id === currentTeacher.id) {
              filteredItems.push(lesson);
            }
          });
        });
        return filteredItems;
    }
});


//Find the correct classroom based on the current selections
diogenisApp.filter('classroomFilter', function () {
    return function ( items, labList, currentTeacher, currentLesson ) {
        var filteredItems = []
        if (currentTeacher === undefined || currentLesson === undefined) {
          return filteredItems;
        }

        angular.forEach(items, function (classroom ) {
          angular.forEach(labList, function(lab){
            if (lab.teacherid == currentTeacher.id && lab.lessonid == currentLesson.id && lab.classroomid === classroom.id ) {
              var classroomExists = false;
              angular.forEach(filteredItems, function(value) {
                if (value.id == classroom.id) {
                  classroomExists = true;
                }
              });

              if (!classroomExists) {
                filteredItems.push(classroom);
              }
            }
          });
        });
        return filteredItems;
    }
});

//Find the correct day based on the current selections
diogenisApp.filter('dayFilter', function () {
    return function ( items, labList, currentTeacher, currentLesson, currentClassroom) {
        var filteredItems = []
        if (currentTeacher === undefined || currentLesson === undefined || currentClassroom === undefined) {
          return filteredItems;
        }
        angular.forEach(items, function (day) {
          angular.forEach(labList, function(lab){
            if (lab.teacherid == currentTeacher.id && lab.lessonid == currentLesson.id
                && lab.classroomid === currentClassroom.id && lab.day == day.id) {
              var classroomExists = false;
              angular.forEach(filteredItems, function(value) {
                if (value == day.name) {
                  classroomExists = true;
                }
              });

              if (!classroomExists && filteredItems.indexOf(day) < 0) {
                filteredItems.push(day);
              }

            }
          });
        });
        return filteredItems;
    }
});


//Find the correct time based on the current selections
diogenisApp.filter('generateTime', function () {
    return function (items, labList, currentTeacher, currentLesson, currentClassroom, currentDay) {
        var filteredItems = []
        if (currentTeacher === undefined || currentLesson === undefined || currentClassroom === undefined || currentDay == undefined) {
          return filteredItems;
        }

        var day = [
          {id: 1, name: "Δευτέρα"},
          {id: 2, name: "Τρίτη"},
          {id: 3, name: "Τετάρτη"},
          {id: 4, name: "Πέμπτη"},
          {id: 5, name: "Παρασκευή"}
        ]

        angular.forEach(labList, function(lab){
          if (lab.teacherid == currentTeacher.id && lab.lessonid == currentLesson.id
              && lab.classroomid === currentClassroom.id && lab.day == currentDay.id) {
            var timeExists = false;
            angular.forEach(filteredItems, function(value) {
              if (value == day.name) {
                timeExists = true;
              }
            });

            if (!timeExists) {
              var time = lab.timestart + " - " + lab.timeend;
              filteredItems.push(time);
            }

          }
        });
        return filteredItems;
    }
});

