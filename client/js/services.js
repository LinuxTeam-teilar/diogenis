'use strict';

/* Services */

var diogenisServices = angular.module('diogenisServices', ['ngResource']);

diogenisServices.factory('Person', ['$resource',
  function($resource){
    return $resource(':role/auth', {}, {
      loginSecretary: {method: 'POST', params: {role: 'secretary'} },
      loginTeacher: {method: 'POST', params: {role: 'teacher'} },
      loginStudent: {method: 'POST', params: {role: 'student'} }
    });
  }]);

