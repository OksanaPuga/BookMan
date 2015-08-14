angular.module('bookman', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/books'
        })
        .when('/books', {
            templateUrl: 'templates/pages/books/index.html',
            controller: 'BooksController',
            controllerAs: 'booksCtrl'
        })
        .when('/search', {
            templateUrl: 'templates/pages/search/index.html',
            controller: 'SearchController'
        })
        .when('/books/:id', {
            templateUrl: 'templates/pages/books/details.html',
            controller: 'BookDetailsController',
            controllerAs: 'bookDetCtrl'
        })
        .when('/books/:id/edit', {
            templateUrl: 'templates/pages/books/edit.html',
            controller: 'BookEditController',
            controllerAs: 'bookEditCtrl'
        })
}]);
