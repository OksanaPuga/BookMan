angular.module('bookman')
    .directive('mainNav', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/directives/main-nav.html',
            scope: true,
            link: function($scope, element, attrs) {
                $scope.class = "";
                element.find("a.btn-menu").on('click', function() {
                    if ($scope.class == ""){
                        $scope.class = "active"
                    } else {
                        $scope.class = "";
                    }
                    
                });         
            },
            controller: function($scope, $location) {
               $scope.isActive = function (viewLocation) {
                     return viewLocation === $location.path();
                };    
            }
        }
    });