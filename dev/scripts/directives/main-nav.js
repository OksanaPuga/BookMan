angular.module('bookman')
    .directive('mainNav', [ '$location', function($location){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/main-nav.html',
            scope: {},
            link: function(scope, element, attrs) {
                scope.class = "";
                scope.openMenu = function() {
                    if (scope.class == ""){
                        scope.class = "active"
                    } else {
                        scope.class = "";
                    }
                } 
                scope.isActive = function (viewLocation) {
                     return viewLocation === $location.path();
                };          
            }
        }
    }]);