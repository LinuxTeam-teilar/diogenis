'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisHelpCtrl', ['$scope', '$routeParams', '$http', '$route', '$location', '$filter', '$cookieStore', 'GenerateFullName',
  function($scope, $routeParams, $http, $route, $location, $filter, $cookieStore, GenerateFullName) {
  $scope.fullName = GenerateFullName;

  }]);
