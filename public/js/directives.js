'use strict';

var mainDirectives = angular.module('mainDirectives', []);

mainDirectives.directive('blgMenu', function() {
    return {
        restrict: 'A',
        templateUrl: 'partials/menu.html',
        link: function (scope, el, attrs) {
            scope.label = attrs.menuTitle;
        }
    };
});

mainDirectives.directive("navBar", function() {
    return {
        template : 'partials/navbar.html'
    };
});
