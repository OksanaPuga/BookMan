angular.module('bookman')
    .controller('BooksController', ['$scope', 'Books', 'Book', 'Buttons', function ($scope, Books, Book, Buttons) {

		if (!localStorage.getItem('books')) {
		    Books.init().then(function(promise) {
		        $scope.books = Books.getAllBooks();          
		    });
		} else {
			$scope.books = Books.getAllBooks();
		}
        
        $scope.showShortInfo = Buttons.showShortInfo;

    }]);
