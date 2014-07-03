'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'mm.foundation',
  'phonecatControllers',
  'phonecatServices'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/secretary', {
        templateUrl: 'partials/secretary.html',
        controller: 'DiogenisSecreteryTeacher'
      }).
      otherwise({
        redirectTo: '/secretary'
      });
  }]);
