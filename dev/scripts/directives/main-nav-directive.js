angular.module('bookman')
    .directive('mainNav', ['$location', '$rootScope', function($location, $rootscope) {
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/main-nav.html',
            link: function(scope, element, attrs) {
                $rootscope.isActiveAside = false;
                scope.openAside = function() {
                    $rootscope.isActiveAside = !$rootscope.isActiveAside;
                }
                scope.isActive = function(viewLocation) {
                    return viewLocation === $location.path();
                };
            }
        }
    }]);