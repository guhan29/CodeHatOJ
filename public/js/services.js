'use strict';

var mainServices = angular.module('mainServices', ['ngResource']);

mainServices.factory('BlogPost', ['$resource', 
function($resource) {
    return $resource('http://localhost:4001/blogList/:id', {}, {
        get: { method: 'GET', cache: false, isArray: false },
        save: { method: 'POST', cache: false, isArray: false },
        update: { method: 'PUT', cache: false, isArray: false },
        delete: { method: 'DELETE', cache: false, isArray: false }
    });
}]);

mainServices.factory('BlogList', ['$resource',
function($resource) {
    return $resource("http://localhost:4001/blogList", {}, {
        get: {method: 'GET', cache: false, isArray: true}            
    });
}]);

mainServices.factory('Login', ['$resource', function($resource) {
    return $resource(
        '/api/auth/login', 
        {}, {
        login: {method: 'POST', cache: false, isArray: false}
    });
}]);
