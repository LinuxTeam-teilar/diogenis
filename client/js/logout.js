'use strict';

/* Controllers */

diogenisControllers.controller('DiogenisLogoutCtrl', ['$scope', '$routeParams', 'Person', '$location', '$cookieStore',
  function($scope, $routeParams, Person, $location, $cookieStore) {
    $cookieStore.remove('type');
    $cookieStore.remove('id');
    $cookieStore.remove('fullName');
    $cookieStore.remove('studentAM');
    window.location.replace('/logout');
  }]);
