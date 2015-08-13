angular.module('bookman').controller('SearchController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {
    
    $scope.books = Books.getAllBooks();

}]);