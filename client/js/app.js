'use strict';

/* App Module */

var diogenisApp = angular.module('diogenisApp', [
  'ngRoute',
  'ui.bootstrap',
  'diogenisControllers',
  'diogenisServices'
]);

diogenisApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/secretary', {
        templateUrl: 'partials/secretary.html',
        controller: 'DiogenisSecreteryTeacher'
      }).
      when('/', {
        templateUrl: 'partials/home.html',
        controller: 'DiogenisLoginCtrl'
      }).
      otherwise({
        redirectTo: '/secretary'
      });
  }]);
