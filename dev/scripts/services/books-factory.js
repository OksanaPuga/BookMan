angular.module('bookman').factory('Books', function BooksFactory($http, Book) {
    var factory = {};

    factory.init = function () {
        return $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes");
    };
    factory.getAllBooks = function () {
        return angular.fromJson(sessionStorage.getItem('books'));
    };
    factory.getBookByID = function (id) {
        var books = angular.fromJson(sessionStorage.getItem('books'));
        for (var i = 0; i < books.length; i++) {
            if (books[i].id === id) {
                return books[i];
            }
        }
    };

    factory.init().success(function (response) {
        var book, elm, obj, appBooks = response.items;
        for (var property in appBooks) {
            elm = appBooks[property];
            obj = {
                id: elm.id,
                title: elm.volumeInfo.title,
                author: elm.volumeInfo.authors[0],
                publisher: elm.volumeInfo.publisher,
                publicationDate: elm.volumeInfo.publishedDate,
                image: elm.volumeInfo.imageLinks.thumbnail,

                length: elm.volumeInfo.pageCount,
                description: elm.volumeInfo.description
            }
            book = new Book(obj);
            book.update();
        }
    });
    return factory;
});
