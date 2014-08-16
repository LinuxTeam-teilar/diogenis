'use strict';

/* Services */

var diogenisServices = angular.module('diogenisServices', ['ngResource']);

diogenisServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);



diogenisServices.factory('Person', ['$resource',
  function($resource){
    return $resource(':role/auth', {}, {
      loginSecretary: {method:'POST', params: {role: 'secretary'} },
      loginTeacher: {method:'POST', params: {role: 'teacher'} }
    });
  }]);

