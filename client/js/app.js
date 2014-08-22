'use strict';

/* App Module */

var diogenisApp = angular.module('diogenisApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngGrid',
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
      otherwise({
        redirectTo: '/secretary'
      });
  }]);
