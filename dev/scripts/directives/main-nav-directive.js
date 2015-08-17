angular.module('bookman')
    .directive('mainNav', [ '$location', function($location){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/main-nav.html',
            scope: {},
            link: function(scope, element, attrs) {
                scope.isActiveClass = false;
                scope.openMenu = function() {
                    scope.isActiveClass = !scope.isActiveClass;
                } 
                scope.isActive = function (viewLocation) {
                     return viewLocation === $location.path();
                };          
            }
        }
    }]);