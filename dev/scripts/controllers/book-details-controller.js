angular.module('bookman').controller('BooksDetailController', ['$scope', '$routeParams', 'Books', function ($scope, $routeParams, Books) {
	$scope.book = Books.getBookByID($routeParams.id);
}]);
