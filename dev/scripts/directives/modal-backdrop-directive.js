angular.module('bookman')
    .directive('modalBackdrop', [ '$location','$rootScope', function($location, $rootscope){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/modal-backdrop.html',
            link: function(scope, element, attrs) {               
                $rootscope.isActiveAside = true;
                scope.closeAside = function() {
                    $rootscope.isActiveAside = false;
                }  
            }
        }
    }]);