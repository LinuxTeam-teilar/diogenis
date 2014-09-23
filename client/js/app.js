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
