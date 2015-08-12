 angular.module('bookman', ['ngRoute'])
     .factory('Books', function BooksFactory($http) {
         var factory = {},
             allBooks = [];
         factory.getAppBooks = function () {
             return $http.get("https://www.googleapis.com/books/v1/users/114873229240336350134/bookshelves/0/volumes");
         };
         factory.getAllBooks = function () {
             return angular.fromJson(sessionStorage.getItem('books'));
         };
         factory.getBookByID = function (id) {
             var books = angular.fromJson(sessionStorage.getItem('books'));
             console.log(books[id]);
             return books[id];
         };
         return factory;
     });
