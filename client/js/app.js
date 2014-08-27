'use strict';

/* App Module */

var diogenisApp = angular.module('diogenisApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngGrid',
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
      otherwise({
        redirectTo: '/secretary'
      });
  }]);
