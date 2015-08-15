angular.module('bookman')
    .controller('BookInfoController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'info';
        $scope.abstractUrl = '#/books/' + $routeParams.id + '/abstract';
        $scope.contentUrl = '#/books/' + $routeParams.id + '/content';

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }

}]);
