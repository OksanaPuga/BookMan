angular.module('bookman')
    .controller('BookDetailsController', ['$scope', '$routeParams', 'Books', function ($scope, $routeParams, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'info';

        $scope.changeTab = function (tab) {
            $scope.currentTab = tab;
        }

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }
}]);
