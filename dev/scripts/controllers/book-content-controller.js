angular.module('bookman')
    .controller('BookContentController', ['$scope', '$routeParams', 'Book', 'Books', function ($scope, $routeParams, Book, Books) {

        $scope.book = Books.getBookByID($routeParams.id);
        $scope.currentTab = 'cont';
        $scope.infoUrl = '#/books/' + $routeParams.id + '/info';
        $scope.abstractUrl = '#/books/' + $routeParams.id + '/abstract';

        $scope.isCurrent = function (tab) {
            return $scope.currentTab === tab;
        }
}]);
