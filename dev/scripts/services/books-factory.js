angular.module('bookman').factory('Books', function BooksFactory($http, Book) {
    var factory = {};
    factory.defaultcover = "images/Book.jpg";
    factory.init = function() {
        var promise = $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes");
        promise.success(function(response) {
            var book, elm, obj, appBooks = response.items;
            for (var property in appBooks) {
                elm = appBooks[property];
                obj = {
                    id: elm.id,
                    title: elm.volumeInfo.title,
                    author: elm.volumeInfo.authors,
                    publisher: elm.volumeInfo.publisher,
                    publicationDate: elm.volumeInfo.publishedDate,
                    image: elm.volumeInfo.imageLinks ? elm.volumeInfo.imageLinks.thumbnail : factory.defaultcover,
                    category: elm.volumeInfo.categories,
                    length: elm.volumeInfo.pageCount,
                    description: elm.volumeInfo.description
                }
                book = new Book(obj);
                book.update();
            }
        });
        return promise;
    };

    factory.getAllBooks = function() {
        return angular.fromJson(localStorage.getItem('books'));
    };
    factory.getBookByID = function(id) {
        var books = angular.fromJson(localStorage.getItem('books'));
        for (var i = 0; i < books.length; i++) {
            if (books[i].id === id) {
                return books[i];
            }
        }
    };

    return factory;
});