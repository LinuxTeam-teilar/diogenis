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

/* App Module */

var diogenisApp = angular.module('diogenisApp', [
  'ngRoute',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.resizeColumns',
  'ngCookies',
  'multi-select',
  'diogenisControllers',
  'diogenisServices'
]);

diogenisApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'DiogenisLoginCtrl'
      }).
      when('/secretary', {
        templateUrl: 'partials/secretary.html',
        controller: 'DiogenisSecretaryCtrl'
      }).
      when('/teacher', {
        templateUrl: 'partials/teacher.html',
        controller: 'DiogenisTeacherCtrl'
      }).
      when('/student', {
        templateUrl: 'partials/student.html',
        controller: 'DiogenisStudentCtrl'
      }).
      when('/logout', {
        templateUrl: 'partials/logout.html',
        controller: 'DiogenisLogoutCtrl'
      }).
      when('/help', {
        templateUrl: 'partials/help.html',
        controller: 'DiogenisHelpCtrl'
      }).
      otherwise({
        redirectTo: '/secretary'
      });
  }]);

