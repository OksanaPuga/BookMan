angular.module('bookman')
    .controller('BookInfoController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'info';

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }

}]);
