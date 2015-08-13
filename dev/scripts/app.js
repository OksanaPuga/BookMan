angular.module('bookman', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/pages/books/index.html',
            controller: 'BooksController'
        })
        .when('/search', {
            templateUrl: 'templates/pages/search/index.html',
            controller: 'SearchController'
        })
        .when('/book/:id', {
            templateUrl: '/bookDetails.html',
            controller: 'BooksDetailController'
        })
        .when('/:alias', {
            templateUrl: '/singePage.html',
            controller: 'SingePageController'
        });
}]);
