angular.module('bookman')
    .controller('BooksController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {

		if (!localStorage.getItem('books')) {
		    Books.init().then(function(promise) {
		        $scope.books = Books.getAllBooks();          
		    });
		} else {
			$scope.books = Books.getAllBooks();
		}

    }]);
