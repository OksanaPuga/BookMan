angular.module('bookman', ['ngRoute'])
    .controller('BooksController', ['$scope', 'Books', 'Book', function ($scope, Books, Book) {
        //sessionStorage.clear();
        Books.getAppBooks().success(function (response) {
            var book, elm, obj, appBooks = response.items;
            for (var property in appBooks) {
                elm = appBooks[property];
                obj = {
                    id: elm.id,
                    title: elm.volumeInfo.title,
                    authors: elm.volumeInfo.authors,
                    image: elm.volumeInfo.imageLinks.thumbnail
                }
                book = new Book(obj);
                book.save();
            }

            $scope.books = Books.getAllBooks();
        });
}])
