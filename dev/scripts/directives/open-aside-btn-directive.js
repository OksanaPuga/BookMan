angular.module('bookman')
    .directive('openAsideBtn', ['$rootScope', function(rootScope){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/open-aside-btn.html',
            scope: {},
            link: function(scope, element, attrs) {
                scope.isActiveClass = false;
                rootScope.isActiveClassContent = false;
                scope.openAside = function() {
                   scope.isActiveClass = !scope.isActiveClass;
                   rootScope.isActiveClassContent = !rootScope.isActiveClassContent
                }     
            }
        }
    }]);

